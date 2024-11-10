import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import multer from 'multer'
import { v4 as uuidv4 } from "uuid"
import path from "path"
import fs from "fs"
import { exec } from "child_process" // watch out
import { stderr, stdout } from "process"
//routes
import authRoutes from './routes/auth.js';
import podcastsRoutes from './routes/podcast.js';
import userRoutes from './routes/user.js';
import { fileURLToPath } from 'url';
import doubtClassRequest from './routes/doubtClassRequest.js'
const app = express();
dotenv.config();

/** Middlewares */
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
const corsConfig = {
    credentials: true,
    origin: true,
};
app.use(cors(corsConfig));
app.use(morgan('tiny'));
app.disable('x-powered-by');
app.use(function (request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const port = process.env.PORT || 8700;

const connect = () => {
    mongoose.set('strictQuery', true);
    mongoose.connect(process.env.MONGO_URL).then(() => {
        console.log('MongoDB connected');
    }).catch((err) => {
        console.log(err);
    });
};


app.use(express.json())
// app.enable('trust proxy'); // optional, not needed for secure cookies
// app.use(express.session({
//     secret : '123456',
//     key : 'sid',
//     proxy : true, // add this when behind a reverse proxy, if you need secure cookies
//     cookie : {
//         secure : true,
//         maxAge: 5184000000 // 2 months
//     }
// }));

app.use("/api/auth", authRoutes)
app.use("/api/podcasts", podcastsRoutes)
app.use("/api/user", userRoutes)
app.use("/api/doubtClassRequest", doubtClassRequest)
// app.use("/api/project", projectRoutes)
// app.use("/api/team", teamRoutes)
// Configure multer for file uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}


const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/api/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ error: "No file uploaded." });
    }

    const outputPath = path.join(uploadsDir, `${Date.now()}-${file.originalname}`);
    const writeStream = fs.createWriteStream(outputPath);

    // Stream the file buffer to disk in chunks
    writeStream.write(file.buffer, () => {
        writeStream.end();
        return res.status(201).json({ message: 'File uploaded successfully', url: `/video/${path.basename(outputPath)}` });
    });
    writeStream.on('error', (error) => {
        console.error("Error writing file:", error);
        return res.status(500).json({ error: "Failed to save video" });
    });
});

// Endpoint to stream the video
app.get('/video/:filename', (req, res) => {
    const videoPath = path.join(uploadsDir, req.params.filename);
    if (!fs.existsSync(videoPath)) {
        return res.status(404).json({ error: "Video not found" });
    }

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
        // Parse the range header
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        const chunkSize = (end - start) + 1;
        const file = fs.createReadStream(videoPath, { start, end });
        const headers = {
            "Content-Range": `bytes ${start}-${end}/${fileSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": chunkSize,
            "Content-Type": "video/mp4",
        };

        res.writeHead(206, headers);
        file.pipe(res);
    } else {
        const headers = {
            "Content-Length": fileSize,
            "Content-Type": "video/mp4",
        };
        res.writeHead(200, headers);
        fs.createReadStream(videoPath).pipe(res);
    }
});

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    return res.status(status).json({
        success: false,
        status,
        message
    })
})

app.listen(port, () => {
    console.log("Connected")
    connect();
})

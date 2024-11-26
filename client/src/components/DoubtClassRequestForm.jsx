import { BackupRounded, CloseRounded, CloudDone, CloudDoneRounded, Create } from '@mui/icons-material';
import { CircularProgress, IconButton, LinearProgress, Modal } from "@mui/material";
import React, { useEffect } from 'react'
import styled from 'styled-components'
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from "firebase/storage";
import app from "../firebase";
import ImageSelector from "./ImageSelector";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../redux/snackbarSlice";
import { createDoubtClassRequest, createPodcast, uploadFileOnServer } from '../api';
import { Category } from '../utils/Data';

const Container = styled.div`
width: 100%;
height: 100%;
position: absolute;
top: 0;
left: 0;
background-color: #000000a7;
display: flex;
align-items: top;
justify-content: center;
overflow-y: scroll;
`;

const Wrapper = styled.div`
max-width: 500px;
width: 100%;
border-radius: 16px;
margin: 50px 20px;
height: min-content;
background-color: ${({ theme }) => theme.card};
color: ${({ theme }) => theme.text_primary};
padding: 10px;
display: flex;
flex-direction: column;
position: relative;
`;

const Title = styled.div`
  font-size: 22px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
  margin: 12px 20px;
`;

const TextInput = styled.input`
width: 100%;
border: none;
font-size: 14px;
border-radius: 3px;
background-color: transparent;
outline: none;
color: ${({ theme }) => theme.text_secondary};
`;

const Desc = styled.textarea`
  width: 100%;
  border: none;
  font-size: 14px;
  border-radius: 3px;
  background-color: transparent;
  outline: none;
  padding: 10px 0px;
  color: ${({ theme }) => theme.text_secondary};
`;


const Label = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary + 80};
  margin: 12px 20px 0px 20px;
`;


const OutlinedBox = styled.div`
  min-height: 48px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.text_secondary};
  color: ${({ theme }) => theme.text_secondary};
  ${({ googleButton, theme }) =>
        googleButton &&
        `
    user-select: none; 
  gap: 16px;`}
  ${({ button, theme }) =>
        button &&
        `
    user-select: none; 
  border: none;
    font-weight: 600;
    font-size: 16px;
    background: ${theme.button};
    color:'${theme.bg}';`}
    ${({ activeButton, theme }) =>
        activeButton &&
        `
    user-select: none; 
  border: none;
    background: ${theme.primary};
    color: white;`}
  margin: 3px 20px;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px 14px;
`;

const Select = styled.select`
    width: 100%;
    border: none;
    font-size: 14px;
    border-radius: 3px;
    background-color: transparent;
    outline: none;
    color: ${({ theme }) => theme.text_secondary};
`;

const Option = styled.option`
    width: 100%;
    border: none;
    font-size: 14px;
    border-radius: 3px;
    background-color: ${({ theme }) => theme.card};
    outline: none;
    color: ${({ theme }) => theme.text_secondary};
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 0px;
  margin: 6px 20px 20px 20px;
  align-items: center;
  gap: 12px;

`;

const FileUpload = styled.label`
    display: flex;
    min-height: 48px;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin: 16px 20px 3px 20px;
    border: 1px dashed ${({ theme }) => theme.text_secondary};
    border-radius: 8px;
    padding: 10px;
    cursor: pointer;
    color: ${({ theme }) => theme.text_secondary};
    &:hover {
        background-color: ${({ theme }) => theme.text_secondary + 20};
    }
`;

const File = styled.input`
    display: none;
`;

const Uploading = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 12px;
`;



const DoubtClassRequestForm = ({ setUploadOpen }) => {
    const [podcast, setPodcast] = React.useState({
        title: "",
        desc: "",
        thumbnail: "",
        tags: [],
        subject: "",
        type: "audio",
        classTime: "",
        doubtLevel: "",
    });
    const [showEpisode, setShowEpisode] = React.useState(false);
    const [disabled, setDisabled] = React.useState(true);
    const [backDisabled, setBackDisabled] = React.useState(false);
    const [createDisabled, setCreateDisabled] = React.useState(true);
    const [loading, setLoading] = React.useState(false);

    const dispatch = useDispatch();

    const token = localStorage.getItem("podstreamtoken");

    const goToAddEpisodes = () => {
        setShowEpisode(true);
    };

    const goToPodcast = () => {
        setShowEpisode(false);
    };

    useEffect(() => {
        if (podcast === null) {
            setDisabled(true);
            setPodcast({
                title: "",
                desc: "",
                thumbnail: "",
                tags: [],
                subject: "",
                type: "audio",
                classTime: "",
                doubtLevel: "",
            });
        } else {
            if (podcast.name === "" && podcast.desc === "") {
                setDisabled(true);
            } else {
                setDisabled(false);
            }
        }
    }, [podcast]);

    const uploadFile = (file, index) => {
        const formData = new FormData()
        formData.append("file", file);
        uploadFileOnServer(formData).then((data) => {
            console.log("File uploaded successfully", data?.url);
            podcast.episodes[index].file.uploadProgress = 100;
            setPodcast({ ...podcast, episodes: podcast.episodes });
            const newEpisodes = podcast.episodes;
            newEpisodes[index].file = data?.data?.url;
            setPodcast({ ...podcast, episodes: newEpisodes });
            setCreateDisabled(false);
        })
    };

    const createpodcast = async () => {
        console.log(podcast);
        setLoading(true);
        await createDoubtClassRequest(podcast, token).then((res) => {
            console.log(res);
            setDisabled(true);
            setBackDisabled(true);
            setUploadOpen(false);
            setLoading(false);
            dispatch(
                openSnackbar({
                    open: true,
                    message: "Doubt Class Requested successfully",
                    severity: "success",
                })
            )
        }
        ).catch((err) => {
            setDisabled(false);
            setBackDisabled(false);
            setLoading(false);
            console.log(err);
            dispatch(
                openSnackbar({
                    open: true,
                    message: "Error Requesting  Doubt Class.",
                    severity: "error",
                })
            )
        });
    };

    return (
        <Modal open={true} onClose={() => setUploadOpen(false)}>
            <Container>
                <Wrapper>
                    <CloseRounded
                        style={{
                            position: "absolute",
                            top: "24px",
                            right: "30px",
                            cursor: "pointer",
                        }}
                        onClick={() => setUploadOpen(false)}
                    />
                    <Title>Request A Class</Title>
                    {!showEpisode ? (
                        <>
                            <Label>Doubt Details:</Label>
                            <ImageSelector podcast={podcast} setPodcast={setPodcast} />
                            <OutlinedBox style={{ marginTop: "12px" }}>
                                <TextInput
                                    placeholder="Doubt Title*"
                                    type="text"
                                    value={podcast?.title}
                                    onChange={(e) => setPodcast({ ...podcast, title: e.target.value })}
                                />
                            </OutlinedBox>
                            <OutlinedBox style={{ marginTop: "6px" }}>
                                <Desc
                                    placeholder="Doubt Description* "
                                    name="desc"
                                    rows={5}
                                    value={podcast?.desc}
                                    onChange={(e) => setPodcast({ ...podcast, desc: e.target.value })}
                                />
                            </OutlinedBox>
                            <OutlinedBox style={{ marginTop: "6px" }}>
                                <Desc
                                    placeholder="Tags seperate by ,"
                                    name="tags"
                                    rows={4}
                                    value={podcast?.tags}
                                    onChange={(e) => setPodcast({ ...podcast, tags: e.target.value.split(",") })}
                                />
                            </OutlinedBox>
                            <div style={{ display: 'flex', gap: '0px', width: '100%', gap: '6px' }}>
                                <OutlinedBox style={{ marginTop: "6px", width: '100%', marginRight: '0px' }}>
                                    <Select
                                        disabled
                                        onChange={
                                            (e) => setPodcast({ ...podcast, type: e.target.value })
                                        }>
                                        {/* <Option value="audio">Audio</Option> */}
                                        <Option value="video">Video</Option>
                                    </Select>
                                </OutlinedBox>
                                <OutlinedBox style={{ marginTop: "6px", width: '100%', marginLeft: '0px' }}>
                                    <Select
                                        onChange={
                                            (e) => setPodcast({ ...podcast, subject: e.target.value })
                                        }
                                    >
                                        <Option value={podcast.subject} selected disabled hidden>Select Subject</Option>
                                        {[
                                            "Mathematics",
                                            "English",
                                            "Science",
                                            "Social Studies",
                                            "Environmental Studies",
                                            "Physical Education",
                                            "Art",
                                            "Music",
                                            "Computer Science",
                                            "History",
                                            "Geography",
                                            "Biology",
                                            "Chemistry",
                                            "Physics",
                                            "Economics",
                                            "Political Science",
                                            "Sociology",
                                            "Psychology",
                                            "Philosophy",
                                            "Business Studies",
                                            "Accountancy",
                                            "Statistics",
                                            "Computer Applications",
                                            "Information Technology",
                                            "Electronics",
                                            "Mechanical Engineering",
                                            "Civil Engineering",
                                            "Electrical Engineering",
                                            "Marketing",
                                            "Finance",
                                            "Human Resource Management",
                                            "Operations Management",
                                            "Entrepreneurship",
                                            "Public Administration",
                                            "Law",
                                            "Education",
                                            "Library Science",
                                            "Biotechnology",
                                            "Genetics",
                                            "Microbiology",
                                            "Zoology",
                                            "Botany",
                                            "Environmental Science",
                                            "Agricultural Science",
                                            "Forestry",
                                            "Veterinary Science",
                                            "Medicine",
                                            "Dentistry",
                                            "Nursing",
                                            "Pharmacy",
                                            "Public Health",
                                            "Nutrition",
                                            "Physiotherapy",
                                            "Sports Science",
                                            "Astronomy",
                                            "Anthropology",
                                            "Archaeology",
                                            "Linguistics",
                                            "Literature",
                                            "Fine Arts",
                                            "Theatre",
                                            "Film Studies",
                                            "Media Studies",
                                            "Journalism",
                                            "Mass Communication",
                                            "International Relations",
                                            "Gender Studies",
                                            "Cultural Studies",
                                            "Theology",
                                            "Religious Studies",
                                            "Architecture",
                                            "Urban Planning",
                                            "Fashion Design",
                                            "Interior Design",
                                            "Graphic Design",
                                            "Animation",
                                            "Data Science",
                                            "Machine Learning",
                                            "Artificial Intelligence",
                                            "Cybersecurity",
                                            "Blockchain",
                                            "Robotics",
                                            "Software Engineering",
                                            "Network Engineering",
                                            "Game Development",
                                            "Digital Marketing",
                                            "Econometrics",
                                            "Geology",
                                            "Oceanography",
                                            "Meteorology",
                                            "Astrophysics",
                                            "Quantum Physics",
                                            "Neuroscience",
                                            "Bioinformatics",
                                            "Ecology",
                                            "Molecular Biology",
                                            "Social Work",
                                            "Cognitive Science",
                                            "Ethics",
                                            "Critical Thinking"
                                        ].map((category) => (
                                            <Option value={category?.toLowerCase()}>{category}</Option>
                                        ))}
                                    </Select>
                                </OutlinedBox>

                            </div>
                            <OutlinedBox
                                button={true}
                                activeButton={!disabled}
                                style={{ marginTop: "22px", marginBottom: "18px" }}
                                onClick={() => {
                                    !disabled && goToAddEpisodes();
                                }}
                            >
                                Next
                            </OutlinedBox>
                        </>
                    ) : (
                        <>
                            <Label>Doubt Details:</Label>
                            <OutlinedBox style={{ marginTop: "12px" }}>
                                <TextInput
                                    placeholder="Doubt Level*"
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={podcast?.doubtLevel}
                                    onChange={(e) => setPodcast({ ...podcast, doubtLevel: e.target.value })}
                                />
                            </OutlinedBox>
                            <OutlinedBox style={{ marginTop: "6px" }}>
                                <TextInput
                                    placeholder="Class Time*"
                                    type="datetime-local"
                                    value={podcast?.classTime}
                                    onChange={(e) => setPodcast({ ...podcast, classTime: e.target.value })}
                                />
                            </OutlinedBox>
                            <ButtonContainer>
                                <OutlinedBox
                                    button={true}
                                    activeButton={false}
                                    style={{ marginTop: "6px", width: "100%", margin: 0 }}
                                    onClick={() => {
                                        !backDisabled && goToPodcast();
                                    }}
                                >
                                    Back
                                </OutlinedBox>
                                <OutlinedBox
                                    button={true}
                                    activeButton={!disabled}
                                    style={{ marginTop: "6px", width: "100%", margin: 0 }}
                                    onClick={() => {
                                        !disabled && createpodcast();
                                    }}
                                >
                                    {loading ? (
                                        <CircularProgress color="inherit" size={20} />
                                    ) : (
                                        "Create"
                                    )}
                                </OutlinedBox>
                            </ButtonContainer>

                        </>
                    )}
                </Wrapper>
            </Container>
        </Modal>
    )
}

export default DoubtClassRequestForm
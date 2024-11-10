import axios from 'axios';
import jwt_decode from 'jwt-decode';
export const BASEURL = `http://localhost:8700`
const API = axios.create({ baseURL: `http://localhost:8700/api` });

//auth
export const signIn = async ({ email, password }) => await API.post('/auth/signin', { email, password });
export const signUp = async ({
    name,
    email,
    password,
}) => await API.post('/auth/signup', {
    name,
    email,
    password,
});
export const googleSignIn = async ({
    name,
    email,
    img,
}) => await API.post('/auth/google', {
    name,
    email,
    img,
});
export const findUserByEmail = async (email) => await API.get(`/auth/findbyemail?email=${email}`);
export const generateOtp = async (email, name, reason) => await API.get(`/auth/generateotp?email=${email}&name=${name}&reason=${reason}`);
export const verifyOtp = async (otp) => await API.get(`/auth/verifyotp?code=${otp}`);
export const resetPassword = async (email, password) => await API.put(`/auth/forgetpassword`, { email, password });

//user api
export const getUsers = async (token) => await API.get('/user', { headers: { "Authorization": `Bearer ${token}` } }, {
    withCredentials: true
});
export const UpdateUser = async (token, body) => await API.put(`/user/${body.userId}`, {
    class: body.class,
    gender: body.gender,
    strengthSubjects: body?.strengthSubject?.split(',').map((it) => {
        let val = it?.split('-')
        return {
            subject: val?.[0],
            level: Number(val?.[1])
        }
    }),
    weakSubjects: body?.weakSubject?.split(',').map((it) => {
        let val = it?.split('-')
        return {
            subject: val?.[0],
            level: Number(val?.[1])
        }
    }),
}, { headers: { "Authorization": `Bearer ${token}` } }, {
    withCredentials: true
});
export const searchUsers = async (search, token) => await API.get(`users/search/${search}`, { headers: { "Authorization": `Bearer ${token}` } }, { withCredentials: true });


//podcast api
export const createPodcast = async (podcast, token) => await API.post('/podcasts', podcast, { headers: { "Authorization": `Bearer ${token}` } }, { withCredentials: true });
export const createDoubtClassRequest = async (DoubtClassBody, token) => await API.post('/doubtClassRequest', DoubtClassBody, { headers: { "Authorization": `Bearer ${token}` } }, { withCredentials: true });
export const getUserDoubtClassRequest = async (token) => await API.get('/doubtClassRequest/byUser', { headers: { "Authorization": `Bearer ${token}` } }, { withCredentials: true });
export const updateUserDoubtClassRequestStatus = async (token, body) => await API.put(`/doubtClassRequest/update/${body?.id}`, body, { headers: { "Authorization": `Bearer ${token}` } }, { withCredentials: true });
export const getOthersDoubtClassRequest = async (token) => await API.get('/doubtClassRequest', { headers: { "Authorization": `Bearer ${token}` } }, { withCredentials: true });

export const getPodcasts = async () => await API.get('/podcasts');
export const addEpisodes = async (podcast, token) => await API.post('/podcasts/episode', podcast, { headers: { "Authorization": `Bearer ${token}` } }, { withCredentials: true });
export const favoritePodcast = async (id, token) => await API.post(`/podcasts/favorit`, { id: id }, { headers: { "Authorization": `Bearer ${token}` } }, { withCredentials: true });
export const getRandomPodcast = async () => await API.get('/podcasts/random');
export const getPodcastByTags = async (tags) => await API.get(`/podcasts/tags?tags=${tags}`);
export const getPodcastByCategory = async (category) => await API.get(`/podcasts/category?q=${category}`);
export const getMostPopularPodcast = async () => await API.get('/podcasts/mostpopular');
export const getPodcastById = async (id) => await API.get(`/podcasts/get/${id}`);
export const addView = async (id) => await API.post(`/podcasts/addview/${id}`);
export const searchPodcast = async (search) => await API.get(`/podcasts/search?q=${search}`);
export const uploadFileOnServer = async (file) => await API.post(`/upload`, file);
export const getFile = async (filePath) => await API.get(`${filePath}`);

import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import styled from "styled-components";
import Avatar from '@mui/material/Avatar';
import { getUsers, UpdateUser } from '../api/index';
import { PodcastCard } from '../components/PodcastCard.jsx'
import { Button, CircularProgress, Grid, IconButton, MenuItem, Select } from "@mui/material";
import Upload from "../components/Upload.jsx";
import { Update, UploadFileRounded, UploadRounded } from "@mui/icons-material";

const ProfileAvatar = styled.div`
  padding-left:3rem;
  @media (max-width: 768px) {
    padding-left:0rem;
    }
`
const ProfileContainer = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
@media (max-width: 768px) {
    align-items: center;
  }
`
const ProfileName = styled.div`
color: ${({ theme }) => theme.text_primary};
font-size:34px;
font-weight:500;
`
const Profile_email = styled.div`
color:#2b6fc2;
font-size:14px;
font-weight:400;
`
const FilterContainer = styled.div`
display: flex;
flex-direction: column;
justify-content: flex-start;
${({ box, theme }) => box && `
background-color: ${theme.bg};
  border-radius: 10px;
  padding: 20px 20px;
`}
`;
const Topic = styled.div`
  color: ${({ theme }) => theme.text_primary};
  font-size: 24px;
  font-weight: 540;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Span = styled.span`
  color: ${({ theme }) => theme.text_secondary};
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  color: ${({ theme }) => theme.primary};
  &:hover{
    transition: 0.2s ease-in-out;
  }
  `;
const Podcasts = styled.div`
display: flex;
flex-wrap: wrap;
gap: 14px;
padding: 18px 6px;
@media (max-width: 550px){
  justify-content: center;
}
`;
const ProfileMain = styled.div`
padding: 20px 30px;
padding-bottom: 200px;
height: 100%;
overflow-y: scroll;
display: flex;
flex-direction: column;
gap: 20px;
`
const UserDetails = styled.div`
display flex;
gap: 120px;
@media (max-width: 768px) {
    width: fit-content;
    flex-direction: column; 
    gap: 20px;
    justify-content: center;
    align-items: center;
  }
`
const Container = styled.div`
display: flex;
justify-content: center;
align-items: center;
`
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

const ButtonContainer = styled.div`
font-size: 14px;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.primary};
  border: 1px solid ${({ theme }) => theme.primary};
  border-radius: 12px;
  width: 100%;
  max-width: 70px;
  padding: 8px 10px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  &:hover{
    background-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.text_primary};
  }
`
const TextInput = styled.input`
width: 100%;
border: none;
font-size: 14px;
border-radius: 3px;
background-color: transparent;
outline: none;
color: ${({ theme }) => theme.text_secondary};
`;

const Profile = () => {
    const [user, setUser] = useState();
    const { currentUser } = useSelector(state => state.user);
    const [name, setName] = useState("");
    const [loader, setLoader] = useState(false)
    const token = localStorage.getItem("podstreamtoken");
    const [uploadValue, setUploadValue] = useState(false)
    const [data, setData] = useState({
        userId: currentUser?._id,
        class: user?.class,
        gender: user?.gender
    })
    const [Loader2, setLoader2] = useState(false)
    const getUser = async () => {
        setLoader(true)
        await getUsers(token).then((res) => {
            setUser(res.data)
            setName(res.data.name);
            setLoader(false)
        }).catch((error) => {
            console.log(error)
            setLoader(false)
        });
    }

    const handleClick = async () => {
        setLoader2(true)
        await UpdateUser(token, data).then((res) => {
            setLoader2(false)
        }).catch((error) => {
            console.log(error)
            setLoader2(false)
        });
    }
    useEffect(() => {
        if (currentUser) {
            getUser();
            // setName(user?.name.split("")[0].toUpperCase());
        }
    }, [currentUser])


    return (
        <ProfileMain>
            {
                loader ? <center><CircularProgress /></center> : <UserDetails>
                    <ProfileAvatar>
                        <Avatar sx={{ height: 165, width: 165, fontSize: '24px' }} src={user?.img}>{user?.name.charAt(0).toUpperCase()}</Avatar>
                    </ProfileAvatar>
                    <ProfileContainer>
                        <ProfileName>{name} ({user?.gender})</ProfileName>
                        <Profile_email>Email: {user?.email}</Profile_email>
                    </ProfileContainer>
                </UserDetails>
            }
            {
                currentUser && <FilterContainer box={true}>
                    <Topic> Additional Info</Topic>
                    {/* <Grid sx={12}> */}
                    <Grid item sx={6}>
                        <OutlinedBox style={{ marginTop: "12px" }}>
                            <Select
                                style={{
                                    width: "100%",
                                    color: "white"
                                }}
                                placeholder="Select gender"
                                type="text"
                                value={data?.gender || user?.gender}
                                onChange={(e) => setData({ ...data, gender: e.target.value })}
                            >
                                <MenuItem value="Male" selected>Male</MenuItem>
                                <MenuItem value="Female">Female</MenuItem>
                            </Select>
                        </OutlinedBox>
                    </Grid>
                    <Grid item sx={6}>
                        <OutlinedBox style={{ marginTop: "12px" }}>
                            <TextInput
                                placeholder="Enter Class*"
                                type="text"
                                value={data?.class || user?.class}
                                onChange={(e) => setData({ ...data, class: e.target.value })}
                            />
                        </OutlinedBox>
                    </Grid>
                    <Grid item sx={6}>

                        {
                            <OutlinedBox style={{ marginTop: "12px" }}>
                                <TextInput
                                    placeholder="Enter Strength Subject like MATH-2, (Subject-level of strength)*"
                                    type="text"
                                    value={data?.strengthSubject || user?.strengthSubjects?.map((it) => it.subject + '-' + it.level)?.join(',')}
                                    onChange={(e) => setData({ ...data, strengthSubject: e.target.value })}
                                />
                            </OutlinedBox>}
                    </Grid>
                    <Grid item sx={6}>
                        <OutlinedBox style={{ marginTop: "12px" }}>
                            <TextInput
                                placeholder="Enter Weak Subject like MATH-2, (Subject-level of weekness)"
                                type="text"
                                value={data?.weakSubject || user?.weakSubjects?.map((it) => it.subject + '-' + it.level)?.join(',')}
                                onChange={(e) => setData({ ...data, weakSubject: e.target.value })}
                            />
                        </OutlinedBox>

                    </Grid>
                    {/* </Grid> */}
                    {<Button variant="contained" onClick={handleClick} sx={{ mt: 1 }}>
                        {Loader2 ? "Loading ...." : "Update"}
                    </Button>}
                </FilterContainer>
            }
            {currentUser && user?.podcasts.length > 0 &&
                <FilterContainer box={true}>
                    <Topic>Your Uploads
                        <IconButton onClick={() => setUploadValue(true)} color={"primary"}><UploadRounded /></IconButton>
                    </Topic>
                    <Podcasts>
                        {user?.podcasts.map((podcast) => (
                            <PodcastCard podcast={podcast} user={user} />
                        ))}
                    </Podcasts>
                </FilterContainer>

            }
            {currentUser && user?.podcasts.length === 0 &&
                <FilterContainer box={true} >
                    <Topic>Your Uploads
                    </Topic>
                    <Container>
                        <ButtonContainer onClick={() => setUploadValue(true)}>Upload</ButtonContainer>
                    </Container>
                </FilterContainer>
            }
            <FilterContainer box={true}>
                <Topic>Your Favourites
                </Topic>
                <Podcasts>
                    {user && user?.favorits.map((podcasts) => (
                        <PodcastCard podcast={podcasts} user={user} />
                    ))}
                </Podcasts>
            </FilterContainer>
            {uploadValue && <Upload setUploadOpen={setUploadValue} />}
        </ProfileMain>
    );
}

export default Profile;
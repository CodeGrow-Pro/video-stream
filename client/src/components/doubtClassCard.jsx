import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import styled from 'styled-components';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useState } from 'react';
import { Button, IconButton } from '@mui/material';
import { favoritePodcast, updateUserDoubtClassRequestStatus } from '../api';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { openSignin } from '../redux/setSigninSlice';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import GroupsIcon from '@mui/icons-material/Groups';
import { randomID } from '../pages/live';
import moment from 'moment';
const PlayIcon = styled.div`
  padding: 10px;
  border-radius: 50%;
  z-index: 100;
  display: flex;
  align-items: center;
  background: blue !important;
  color: white !important;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  position: absolute !important;
  top: 45%;
  right: 10%;
  display: none;
  transition: all 0.4s ease-in-out;
  box-shadow: 0 0 16px 4px blue !important;
`;



const Card = styled(Link)`
position: relative;
text-decoration: none;
background-color: ${({ theme }) => theme.card};
max-width: 220px;
height: auto;
display: flex;
flex-direction: column;
justify-content: flex-start;
align-items: center;
padding: 16px;
border-radius: 6px;  
box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
&:hover{
  cursor: pointer;
  transform: translateY(-8px);
  transition: all 0.4s ease-in-out;
  box-shadow: 0 0 18px 0 rgba(0, 0, 0, 0.3);
  filter: brightness(1.3);
}
&:hover ${PlayIcon}{
  display: flex;
}
`

const Top = styled.div`
display: flex;
justify-content: center;
align-items: center;
height: 150px;
position: relative;
`
const Title = styled.div`
  overflow: hidden;
  display: -webkit-box;
  max-width: 100%;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.text_primary};
`

const Description = styled.div`
  overflow: hidden;
  display: -webkit-box;
  max-width: 100%;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 12px;
`

const CardImage = styled.img`
  object-fit: cover;
  width: 220px;
  height: 140px;
  border-radius: 6px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
  &:hover{
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
  }
`
const CardInformation = styled.div`
  display:flex;
  align-items: flex-end;
  font-weight:450;
  padding: 14px 0px 0px 0px;
  width: 100%;
`
const MainInfo = styled.div`
  display: flex;
  width: 100%;
  flex-direction:column;
  justify-content: flex-start;
  gap: 4px;
  `
const CreatorInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 6px;

  `
const CreatorName = styled.div`
  font-size:12px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.text_secondary};
`
const TimePosted = styled.div`
  color: ${({ theme }) => theme.text_secondary};
`

const Views = styled.div`
  font-size:10px;
  color: ${({ theme }) => theme.text_secondary};
  width: max-content;
`
const Favorite = styled(IconButton)`
  color:white;
  top: 8px;
  right: 6px;
  padding: 6px !important;
  border-radius: 50%;
  z-index: 100;
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.text_secondary + 95} !important;
  color: white !important;
  position: absolute !important;
  backdrop-filter: blur(4px);
  box-shadow: 0 0 16px 6px #222423 !important;
`

export const DoubtClassCard = ({ podcast, user, setSignInOpen }) => {
  const [favourite, setFavourite] = useState(false)
  const [loader, setLoader] = useState(false)
  const dispatch = useDispatch();

  const token = localStorage.getItem("podstreamtoken");

  const favoritpodcast = async () => {
    await favoritePodcast(podcast._id, token).then((res) => {
      if (res.status === 200) {
        setFavourite(!favourite)
      }
    }
    ).catch((err) => {
      console.log(err)
    })
  }

  const updateDoubtClassStatus = async (body) => {
    setLoader(true)
    await updateUserDoubtClassRequestStatus(token, body).then((res) => {
      if (res.status === 200) {
        setLoader(false)
      }
      setLoader(false)
    }
    ).catch((err) => {
      setLoader(false)
      console.log(err)
    })
  }

  React.useEffect(() => {
    //favorits is an array of objects in which each object has a podcast id match it to the current podcast id
    if (user?.favorits?.find((fav) => fav._id === podcast._id)) {
      setFavourite(true)
    }
  }, [user])

  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.user);

  return (
    <Card>
      <div>
        <Top>
          {/* <Link onClick={() => {
            if (!currentUser) {
              dispatch(
                openSignin()
              )
            } else {
              favoritpodcast()
            }
          }}>
            <Favorite >
              {favourite ?
                <FavoriteIcon style={{ color: "#E30022", width: '16px', height: '16px' }}></FavoriteIcon>
                :
                <FavoriteIcon style={{ width: '16px', height: '16px' }}></FavoriteIcon>
              }
            </Favorite>
          </Link> */}
          <CardImage src={podcast.thumbnail || "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/681px-Placeholder_view_vector.svg.png?20220519031949"} />
        </Top>
        <CardInformation>
          <MainInfo>
            <Title>{podcast.title}</Title>
            <Description>{podcast.desc}</Description>
            <CreatorInfo>
              <Description>• {podcast.status}</Description>
              <Views>• {podcast.classTime && moment(podcast?.classTime)?.format("DD-MM-YYYY hh:mm AM")}</Views>
            </CreatorInfo>
            <CreatorInfo>
              {/* <Description>• {podcast.doubtLevel}</Description> */}
              <Views>• {podcast.subject}</Views>
              <Views>• {podcast.chapterName || "Unknown"}</Views>
            </CreatorInfo>
            <CreatorInfo>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Avatar
                  src={podcast?.creator?.img} style={{ width: '26px', height: '26px' }}>{podcast.creator.name?.charAt(0).toUpperCase()}</Avatar>
                <CreatorName>
                  {podcast?.creator?.name}
                </CreatorName>

              </div>
              <Views>• {podcast?.totalAttendees} Views</Views>
            </CreatorInfo>
            <br />
            {
              podcast?.acceptedBy ?
                podcast?.acceptedBy?._id == currentUser?._id ? <Button variant='contained' target='_blank' size='small' style={{ background: "blue" }} onClick={() => {
                  updateDoubtClassStatus({
                    status: "live",
                    id: podcast?._id
                  })
                  window.location.href = podcast?.classMeetingLink
                }
                }>Join As Host</Button> : <Button variant='contained' target='_blank' size='small' style={{ background: "blue" }} onClick={() => {
                  window.location.href = podcast?.classMeetingLink
                }
                }>
                  Join As Student
                </Button>
                : user?._id == podcast?.creator?._id ?
                  <Button variant='outlined' size='small'
                    style={{ background: "green", color: "black" }}>
                      Looking For Mentor!
                    </Button> : <>
                    <Button variant='contained' size='small' style={{ background: "blue" }} onClick={() => updateDoubtClassStatus({
                      status: "accepted",
                      id: podcast?._id,
                      classMeetingLink: window.location.protocol + '//' +
                        window.location.host + '/live' +
                        '?roomID=' +
                        randomID(5)
                    })}>Accept</Button>
                    <Button variant='outlined' size='small' onClick={() => updateDoubtClassStatus({
                      status: "rejected",
                      id: podcast?._id
                    })}
                      style={{ background: "red", color: "black" }}>Reject</Button>
                  </>
            }
          </MainInfo>
        </CardInformation>
      </div>
      <PlayIcon>
        {podcast?.type === 'video' ?
          <GroupsIcon style={{ width: '28px', height: '28px' }} />
          :
          <GroupsIcon style={{ width: '28px', height: '28px' }} />
        }
      </PlayIcon>
    </Card>
  );
}
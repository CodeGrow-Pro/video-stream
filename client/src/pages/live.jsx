import * as React from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { getUsers } from '../api';

export function randomID(len) {
    let result = '';
    if (result) return result;
    var chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP',
        maxPos = chars.length,
        i;
    len = len || 5;
    for (i = 0; i < len; i++) {
        result += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return result;
}

export function getUrlParams(
    url = window.location.href
) {
    let urlStr = url.split('?')[1];
    return new URLSearchParams(urlStr);
}

export default function Live() {
    const { currentUser } = useSelector(state => state.user);
    const [name, setName] = React.useState('');
    const roomID = getUrlParams().get('roomID') || randomID(5);
    const [loader, setLoader] = React.useState(true)
    const token = localStorage.getItem("podstreamtoken");
    let myMeeting = async (element) => {
        // generate Kit Token
        const appID = 1332533179;
        const serverSecret = "597596422afe0e06700544bbbf0ad41a";
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, randomID(5), name);

        // Create instance object from Kit Token.
        const zp = ZegoUIKitPrebuilt.create(kitToken);
        // start the call
        zp.joinRoom({
            container: element,
            sharedLinks: [
                {
                    name: 'Personal link',
                    url:
                        window.location.protocol + '//' +
                        window.location.host + window.location.pathname +
                        '?roomID=' +
                        roomID,
                },
            ],
            scenario: {
                mode: ZegoUIKitPrebuilt.VideoConference,
            },
        });
    };
    const getUser = async () => {
        setLoader(true)
        await getUsers(token).then((res) => {
            setName(res.data.name);
            setLoader(false)
        }).catch((error) => {
            console.log(error)
            setLoader(false)
        });
    }

    React.useEffect(() => {
        setTimeout(() => {
            setLoader(false)
        }, 2000)
        if (currentUser) {
            getUser();
        }
    }, [currentUser])
    return <>
        {
            loader ? <center><CircularProgress /></center> : <div className="myCallContainer" style={{ width: "95%", height: "85%", margin: '20px' }} ref={myMeeting}>
            </div>
        }
    </>
}

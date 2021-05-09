import { useContext, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { FaFacebook, FaLinkedin, FaTwitter, FaDribbble } from 'react-icons/fa';

import * as common from '../../shared/common';
import * as usersService from '../../services/usersService';
import * as messages from '../../shared/messages';
import auth from '../../middlewares/auth';
import './Profile.css';
import { toast } from 'react-toastify';
import AuthContext from '../../contexts/AuthContext';

const Profile = (props) => {    
    const contextValue = useContext(AuthContext);

    let history = useHistory();

    let [userInfo, setUserInfo] = useState({});
    let [displayStyleProps, setDisplayStyleProps] = useState("none");
    
    useEffect(() => {
        let authUserData = auth.isAuthenticated();
        if(authUserData.isAuth) {
            usersService.getCurrentUser(authUserData.currentUserId)
            .then(res => { setUserInfo(res) })
            .catch(err => console.log(err));
        }
    }, []);

    function changeSecretCardStyle() {
        if(localStorage.getItem('utoken')) {
            setDisplayStyleProps(displayStyleProps === "none" ? "block" : "none");
        } else {
            toast.error(messages.GUEST_USER_ERROR);
            history.push('/login');
        }
    }

    function handleChangeCardStyle(e) {
        e.preventDefault();
        changeSecretCardStyle();
        history.push('/profile');
    }

    function redirectToEditPage() {
        if(localStorage.getItem('utoken')) {
            history.push('/editProfile');
        } else {
            toast.error(messages.GUEST_USER_ERROR);
            history.push('/login');
        }
    }

    function handleDeleteAccount(e) {
        e.preventDefault();
        usersService.deleteUser(userInfo.id)
            .then(() => {
                props.handleLogout();
                toast.info("Account successfully deleted");
                history.push('/');
            }).catch(err => console.log(err))
    }

    const status = contextValue.user.status === common.LOGGED_IN_STATUS ? common.ONLINE_USER : common.OFFLINE_USER
    
    return (
        <div className="card">
            <img className="card__img" src="/avatar.png" alt='profile avatar' />
            <h1>{userInfo.name}</h1>
            <p className="card__title">You are currently {status}!</p>
            <p>{userInfo.email}</p>
            <div className="card__icons">
                <Link to="#"> <FaFacebook /> </Link>
                <Link to="#"> <FaTwitter /> </Link>
                <Link to="#"> <FaLinkedin /> </Link>
                <Link to="#"> <FaDribbble /> </Link>
            </div>
            <div className="card__btns">
                <button className="editBtn" onClick={redirectToEditPage}>Edit Profile</button>
                <button className="deleteBtn" onClick={changeSecretCardStyle}>Delete Profile</button>
            </div>
            <div className="card__secret" style={{display: displayStyleProps}}>
                <span className="closeBtn" onClick={changeSecretCardStyle}>&times;</span>
                <form className="secret__content">
                    <div className="content__container">
                        <h1>Permanently delete account</h1>
                        <p>Are you sure you want to remove your account?</p>
                        <div className="container__btns">
                            <button className="cancelBtn" onClick={handleChangeCardStyle}>Cancel</button>
                            <button className="removeBtn" onClick={handleDeleteAccount}>Confirm</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
};

export default Profile;
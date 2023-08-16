import React from "react";
import "./Header.css";
import SearchIcon from "@material-ui/icons/Search";
import HeaderOption from "./HeaderOption";
import HomeIcon from "@material-ui/icons/Home";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import BusinessCenterIcon from "@material-ui/icons/BusinessCenter";
import ChatIcon from "@material-ui/icons/Chat";
import NotificationsIcon from "@material-ui/icons/Notifications";
import AppsIcon from "@material-ui/icons/Apps";
import { useDispatch } from "react-redux";
import { logout } from "../features/userSlice";
import { auth } from "../firebase";

function Header() {
  const dispatch = useDispatch();

  const logOutOfApp = () => {
    dispatch(logout());
    auth.signOut();
  };

  return (
    <div className="header">
      <div className="header__left">
        <img
          src="https://seeklogo.com/images/L/linkedin-new-2020-logo-E14A5D55ED-seeklogo.com.png"
          alt="Linkedin Logo"
        />

        <div className="header__search">
          <SearchIcon />
          <input type="text" placeholder="Search" />
        </div>
      </div>
      <div className="header__right">
        <HeaderOption Icon={HomeIcon} title="Home" isSelected />
        <HeaderOption
          Icon={SupervisorAccountIcon}
          title="My Network"
          isSelected
        />
        <HeaderOption Icon={BusinessCenterIcon} title="Jobs" isSelected />
        <HeaderOption Icon={ChatIcon} title="Messaging" isSelected />
        <HeaderOption
          Icon={NotificationsIcon}
          title="Notifications"
          isSelected
        />
        <HeaderOption title="Me" onClick={logOutOfApp} avatar={true} />
        <HeaderOption Icon={AppsIcon} title="Products" isSelected />
      </div>
    </div>
  );
}

export default Header;

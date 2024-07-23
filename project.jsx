import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import UsBankLogo from '../../assets/logo.svg';
import ElanLogo from '../../assets/Elan-Logo.svg';
import { ELAN_URLS } from '../../constants';
import './navbar.scss';
import USBHeaderNav from './USBHeaderNav'; // Assuming USBHeaderNav is a separate component

const Navbar = (props) => {
  const appType = window.location.hostname.includes(ELAN_URLS.check) ? 'Elan' : 'IC';
  const userDetails = useSelector((state) => state.user.user);
  const mounted = useRef(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const logo = appType === 'IC'
      ? `<img alt="US Bank Instant Card logo" src=${UsBankLogo} className="headerLogo" />`
      : `<img alt="US Bank Elan logo" src=${ElanLogo} className="headerLogo" />`;

    if (!mounted.current) {
      // do componentDidMount logic
      mounted.current = true;
    } else {
      // do componentDidUpdate logic
      if (wrapperRef.current) {
        const navElement = wrapperRef.current.querySelector('.usb-header-nav');
        if (navElement) {
          navElement.innerHTML = `<div class="applicationName">${logo}</div>`;
        }
      }
    }
  }, [appType]);

  const navData = {
    data: {
      getNavigation: () => ({
        navigationList: [
          { id: 'dashboard', value: 'Dashboard', hasSubMenus: true, clickableType: 'InSession', url: '/dashboard', metaData: null },
          { id: 'myRequests', value: 'My Requests', hasSubMenus: true, clickableType: 'InSession', url: null, metaData: null },
          { id: 'activeCards', value: 'Active Cards', hasSubMenus: true, clickableType: 'InSession', url: '/activeCards', metaData: null },
          { id: 'createCard', value: 'Create Card', hasSubMenus: true, clickableType: 'InSession', url: null, metaData: null },
          { id: 'singleCard', value: 'Single Card', hasSubMenus: true, clickableType: 'InSession', url: '/createSingleCard', metaData: null },
          { id: 'bulkCards', value: 'Bulk Cards', hasSubMenus: true, clickableType: 'InSession', url: null, metaData: null },
          { id: 'todayDate', value: 'Friday, February 02', hasSubMenus: false, clickableType: 'InSession', url: 'https://locations.usbank.com/search.html', metaData: null },
          { id: 'notifications', value: 'Notifications', hasSubMenus: false, clickableType: 'InSession', url: '.', metaData: null },
          { id: 'messages', value: 'Messages', hasSubMenus: false, clickableType: 'InSession', url: '.', metaData: null },
          { id: 'logout', value: 'Log out', hasSubMenus: false, clickableType: 'InSession', url: '/Auth/LogoutConfirmation', metaData: null },
          { id: 'updateMyProfile', value: 'Update my profile', hasSubMenus: false, clickableType: 'InSession', url: '/USB/MyProfileDashboard/MyProfileDashboardIndex', metaData: null },
          { id: 'customerName', value: userDetails ? `${userDetails.firstName} ${userDetails.lastName}` : 'User Firstname User Lastname', showDropDown: true, greeting: 'Welcome' }
        ]
      })
    }
  };

  return (
    <div ref={wrapperRef} className="navbar">
      <USBHeaderNav navData={navData} />
    </div>
  );
};

export default Navbar;

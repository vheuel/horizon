import { ProfileRecord } from '@atproto/api';
import { ProfileView } from '@atproto/api/src/client/types/app/bsky/actor/defs';
import cn from 'classnames';
import { SyntheticEvent, useEffect } from 'react';
import { useQuery } from 'react-query';
import { Link, useLocation } from 'react-router-dom';
import agent, { SESSION_LOCAL_STORAGE_KEY } from '../../Agent';
import HomeFillIcon from '../../assets/home-fill.svg';
import HomeIcon from '../../assets/home.svg';
import HorizonIcon from '../../assets/horizon.png';
import LogoutIcon from '../../assets/logout.svg';
import NotificationFillIcon from '../../assets/notification-fill.svg';
import NotificationIcon from '../../assets/notification.svg';
import AvatarPlaceholder from '../../assets/placeholder.png';
import ProfileFillIcon from '../../assets/profile-fill.svg';
import ProfileIcon from '../../assets/profile.svg';
import SettingsFillIcon from '../../assets/settings-fill.svg';
import SettingsIcon from '../../assets/settings.svg';
import ThemeToggle from '../ThemeToggle';
import styles from './Sidebar.module.scss';

export default function Sidebar(props: {
    data: ProfileView | any
}) {
    const { data } = props;
    const { data: notificationData } = useQuery(["unreadNotif"], () => agent.countUnreadNotifications({}), {
        refetchInterval: 5000
    });
    const unreadCount = notificationData?.data.count || 0;
    const location = useLocation();

    const ITEMS = [
        {
            path: '/',
            icon: HomeIcon,
            fillIcon: HomeFillIcon,
            text: 'Home'
        },
        {
            path: '/notifications',
            icon: NotificationIcon,
            fillIcon: NotificationFillIcon,
            text: 'Notifications'
        },
        {
            path: `/user/${data?.handle}`,
            icon: ProfileIcon,
            fillIcon: ProfileFillIcon,
            text: 'Profile'
        },
        {
            path: `/settings`,
            icon: SettingsIcon,
            fillIcon: SettingsFillIcon,
            text: 'Settings'
        },
        {
            path: '/logout',
            icon: LogoutIcon,
            fillIcon: LogoutIcon,
            text: 'Logout'
        }
    ];

    const _handleHomeClick = (e:SyntheticEvent,index:number) => {
        if(index === 0 && location.pathname === '/'){
            e.preventDefault();
            window.scrollTo({
                top:0,
                left:0,
                behavior:'smooth'
            });
        }
    };

    return (
        <div className={cn(styles.sidebar,"sidebar")}>
            <div className={styles.logo}>
                <div>
                    {/* <img src={HorizonIcon} alt="Horizon | a bluesky web client" /> */}
                    <h1>Horizon</h1>
                </div>
                <ThemeToggle />
            </div>
            <Link to={`/user/${data?.handle}`} className={styles.header}>
                <div className={styles.avatar}>
                    <img src={data?.avatar || AvatarPlaceholder} alt={data?.displayName} />
                </div>
                <div>
                    <strong className="d-block">{data?.displayName}</strong>
                    <span className="d-block">{'@' + data?.handle}</span>
                </div>
            </Link>
            <div className={styles.menu}>
                {ITEMS.map((i, index) =>
                    <Link key={index} to={i.path} className={cn(styles.menuItem, { [styles.menuActive]: i.path == location.pathname })} onClick={e => _handleHomeClick(e,index)}>
                        <img alt="" src={i.path == location.pathname ? i.fillIcon : i.icon} />
                        <strong>
                            {i.text}
                            {unreadCount && i.path == '/notifications' ? <span className={styles.badge}>{unreadCount}</span> : ''}
                        </strong>
                    </Link>
                )}
            </div>
        </div>
    );
}
// Libraries
import * as React from 'react';
import { useRouter } from 'next/router';
// import { navigate } from 'gatsby-link';
import { enqueueSnackbar } from 'notistack';

// Mine
// import { getSavedUser, user } from '../../components/admin/utils/user';
import Navigator from './components/Navigator.jsx';
import Header from './components/Header';
// import { documentSaved } from './layout.store'
// import { SocketContext } from "../../global/Socket"
// import pageNavigate from '../../components/realtime/link/pageNavigate.func';
// import { SiteDesignerProvider } from '../../pagesMirror/admin/site-designer/site-designer.context';
// import PageCopyright from "../../components/admin/panels/PageCopyright/PageCopyright.component"

// MUI
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
// import { ___theme } from './layout';
import MeetingPanel from './components/MeetingPanel';
import AdminLayoutContext from './adminLayout.context';
import { initSocket } from '@/utils/realtime/socket.js';
import { getSamePageGraphQL } from '../store/samepage.store.js';
import { getTopNotificationsGraphQL } from '../store/top-notifications.js';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const drawerWidth = 350;

export default function AdminLayoutPage(props) {
  const router = useRouter();
  const adminLayoutContext = React.useContext(AdminLayoutContext)

  // console.log('adminLayoutContext', adminLayoutContext)
  // const theme = ___theme;
  // const router = useRouter()
  // console.log('check', props)
  // const saveAlertMessage = "Document Saved"
  const [isSavedAlertOpened, setIsSavedAlertOpened] = React.useState(false)
  // const [savedMessage, setSavedMessage] = React.useState(saveAlertMessage)
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [lastRoute, setLastRoute] = React.useState({
    pathname: undefined,
    asPath: undefined
  })
  // const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

  // const { socket } = React.useContext(SocketContext)

  // console.log('socket')


  const refreshWhoIsOnPage = async ({ url }) => {
    const usersOnPage = await getSamePageGraphQL({ url, })

    adminLayoutContext.setWhoIsOnPage(prevState => ({
      ...prevState,
      list: usersOnPage.data.collaborateSamePage_getAllUsersFromPage.users,
      total: usersOnPage.data.collaborateSamePage_getAllUsersFromPage.total,

    }))
  }

  React.useEffect(() => {

    const socket = initSocket()

    // delay for socket to fully connect.
    // setTimeout(() => {
    socket.emit('change-url', {
      currentAsPath: router.asPath,
      currentPathname: router.pathname,
      oldAsPath: lastRoute?.asPath,
      oldPathname: lastRoute?.pathname,
    });

    setLastRoute({
      pathname: router.pathname,
      asPath: router.asPath,
    })

    // }, 500)

    // user left page
    socket.on('user-left-page', async (data) => {
      await refreshWhoIsOnPage({ url: router.pathname })
      enqueueSnackbar(data.message)
    })

    // toast
    // refreshWhoIsOnPage

    //user enter page
    socket.on('user-enter-page', async (data) => {
      await refreshWhoIsOnPage({ url: router.pathname })
      enqueueSnackbar(data.message)
    })

    refreshWhoIsOnPage({ url: router.pathname })

    socket.on('new-notification', async () => {
      const newNoti = getTopNotificationsGraphQL();
      const listOfNewNotification = newNoti.data.backendNotification_getFirstByCount

      adminLayoutContext.setNotifications(prevState => ({
        ...prevState,
        badgeCount: adminLayoutContext.notificationCount + 1,
        list: listOfNewNotification,
      }))

    })

    return () => {
      socket.off('user-enter-page')
      socket.off('user-left-page')
      socket.off('new-notification')
    }

  }, [router.pathname]);

  const handleDrawerToggle = () => {
    // setMobileOpen(!mobileOpen);
    adminLayoutContext.setLeftDrawer(prevState => ({
      ...prevState,
      isOpened: !prevState.isOpened,
    }))
  };

  const onMeetingDrawerToggle = () => {
    adminLayoutContext.setRightDrawer(prevState => ({
      ...prevState,
      isOpened: !prevState.isOpened,
    }))
  }

  const handleSavedClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setIsSavedAlertOpened(false)
  };

  return (
    <>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <CssBaseline />
        <Box
          component="nav"
        // sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          {/* {isSmUp ? null : ( */}
          <Navigator
            PaperProps={{ style: { width: drawerWidth } }}
            variant="temporary"
            open={adminLayoutContext.leftDrawer.isOpened}
            onClose={handleDrawerToggle}
          // location={props.location}
          />

          {/* // REAL TIME DISCONNECTED */}
          <MeetingPanel
            PaperProps={{ style: { width: drawerWidth } }}
            variant="temporary"
            open={adminLayoutContext.rightDrawer.isOpened}
            onClose={onMeetingDrawerToggle}
            anchor="right"
          // location={props.location}
          />
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Header onDrawerToggle={handleDrawerToggle} onMeetingDrawerToggle={onMeetingDrawerToggle} tabs={props?.pageContext?.tabs || props?.tabs || []} title={props?.pageContext?.title || props?.title || ""} location={props.location} pageContext={props.pageContext} />
          <Box component="main" sx={{ flex: 1, py: 3, px: 2, bgcolor: '#eaeff1', }}>
            {/* 
            <Box sx={{
              flexGrow: 1,
              width: "100%",
              maxWidth: "900px",
              m: "auto"
            }}> */}
            {props.children}
            {/* </Box> */}
          </Box>
        </Box>
      </Box>
      {/* Possible repeat from header.js file */}
      <Snackbar
        open={isSavedAlertOpened}
        autoHideDuration={6000}
        onClose={handleSavedClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleSavedClose} severity="success" sx={{ width: '100%' }}>
          testing
        </Alert>
      </Snackbar>
    </>


  );
}

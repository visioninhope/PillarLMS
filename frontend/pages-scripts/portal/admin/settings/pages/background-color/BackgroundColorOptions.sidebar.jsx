// 'use client'

import React, { useContext, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import WebsiteSettingLayoutContext from '@/layouts/websiteSettingsLayout/WebsiteSettingLayout.context';
import SettingsBackButton from '../../components/BackButton/BackButton.component';
import AdminLayoutContext from '@/layouts/admin/layout/adminLayout.context';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import HeaderRow from '@/components/global/HeaderRow/HeaderRow.component';
import RealTimeSwitchRow from '@/components/realtime/SwitchRow/SwitchRow.realtime';
import dynamic from 'next/dynamic';
import { SettingBackgroundColorContext } from './context/SettingBackgroundColor.context';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import RealTimeSelectRow from '@/components/realtime/SelectRow/SwitchRow.realtime';
import RealTimeColorSelectionRow from '@/components/realtime/ColorSelectionRow/ColorSelectionRow.realtime';
const DynamicRealTimeTextField = dynamic(() => import('@/components/realtime/TextFieldRow/TextField.realtime'), {
  ssr: false
});

function WebsiteSettingsBackgroundColorSidebar() {
  const theme = useTheme();
  const router = useRouter()

  const [columnSize, setColumnSize] = useState(800)

  const {
    CircleStatusSuccess,
    CircleStatusDanger,
  } = useContext(AdminLayoutContext)

  const {
    isLoaded, setLoaded,
    id, setId,
    entity, setEntity,

    isReady, setIsReady,
    isReadyValue, setIsReadyValue,
  } = useContext(SettingBackgroundColorContext)

  const handleSaved = () => {
    // postSettingBackgroundColorGraphQL({
    //   id,
    //   favicon: faviconValue,
    //   tab: tabValue,
    //   isReady: isReadyValue,
    // })
  }

  return (
    <>
      {isLoaded && (
        <>
          <List sx={{ width: '100%', bgcolor: 'background.paper', p: 0 }}>
            <SettingsBackButton
              label={"Main Menu"}
              href={"/portal/admin/settings/website/settings"}
            />

            {/* New section for Column Size Selector */}
            <Divider component="li" style={{ borderTopWidth: "12px" }} />
            
            <HeaderRow label={"Day/Night Background Mode"} />
            <RealTimeColorSelectionRow
              label={"background"}
              color={{color:"#000", suggestedTextColor: "LIGHT"}}
              data={{color:"#000", suggestedTextColor: "LIGHT"}}
            />
            {/* <ListItem alignItems="flex-start">

              <div>
                <br />
                <FormControl fullWidth>
                  <InputLabel id="column-size-label">Column Size</InputLabel>
                  <Select
                    fullWidth
                    labelId="column-size-label"
                    id="column-size"
                    value={columnSize}
                    onChange={(event) => setColumnSize(event.target.value)}
                  >
                    <MenuItem value={800}>800px</MenuItem>
                    <MenuItem value={1000}>1000px</MenuItem>
                    <MenuItem value={1200}>1200px</MenuItem>
                  </Select>
                </FormControl>
                <br />
              </div>
            </ListItem> */}
            {/* Your existing code */}
            <Divider component="li" style={{ borderTopWidth: "5px" }} />
            <HeaderRow label={"Status"} />
            <RealTimeSwitchRow
              label={(
                <>
                  {isReadyValue
                    ? <CircleStatusSuccess />
                    : <CircleStatusDanger />
                  }
                  &nbsp;
                  <span>Ready?</span>
                </>
              )}
              data={isReady}
              entity={entity}
              onChange={(value) => {
                setIsReadyValue(value)
                console.log('contents to be saved', value)
              }}
            />

            <Divider component="li" style={{ borderTopWidth: "5px" }} />

            <ListItem alignItems="flex-start">
              <ListItemText
                secondary={
                  <React.Fragment>
                    <br />
                    <Button
                      variant="contained"
                      onClick={handleSaved}
                    >
                      Save
                    </Button>
                  </React.Fragment>
                }
              />
            </ListItem>
          </List>
        </>
      )}
    </>
  );
}

export default WebsiteSettingsBackgroundColorSidebar;

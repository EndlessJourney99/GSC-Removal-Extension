import { Tab, TabContent, TabHeader, Tabs } from '../Tabs';
import DeleteIcon from '@mui/icons-material/Delete';
import Link from '@mui/icons-material/Link';
import TabPanel from '../Tabs/TabPanel';
import Removal from './Removal';
import { useEffect, useState } from 'preact/hooks';
import ImportedLinks from './ImportedLinks';

const Functions = () => {
    return (
        <Tabs defaultKey="Removal" className="py-3">
            <TabHeader>
                <Tab icon={<DeleteIcon />} tabKey="Removal">
                    Removal
                </Tab>
                <Tab icon={<Link />} tabKey="Settings">
                    Imported Links
                </Tab>
            </TabHeader>
            <TabContent>
                <TabPanel
                    tabKey="Removal"
                    className="p-4 rounded-lg bg-gray-50"
                >
                    <Removal />
                </TabPanel>
                <TabPanel
                    tabKey="Settings"
                    className="p-4 rounded-lg bg-gray-50"
                >
                    <ImportedLinks />
                </TabPanel>
            </TabContent>
        </Tabs>
    );
};

export default Functions;

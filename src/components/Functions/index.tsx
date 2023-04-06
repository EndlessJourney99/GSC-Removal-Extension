import { Tab, TabContent, TabHeader, Tabs } from '../Tabs';
import DeleteIcon from '@mui/icons-material/Delete';
import Link from '@mui/icons-material/Link';
import TabPanel from '../Tabs/TabPanel';
import Removal from './Removal';
import { useEffect, useState } from 'preact/hooks';

const Functions = () => {
    const [test, setTest] = useState(true);
    useEffect(() => {
        console.log(chrome.runtime.onMessage.hasListeners());
    });
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
                    <p className="text-sm text-black-500">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Voluptatibus hic mollitia expedita amet a dolores
                        doloribus temporibus totam nostrum perferendis. At
                        consequatur iusto eveniet enim quos cumque repudiandae
                        impedit suscipit.
                    </p>
                    <button onClick={() => setTest(!test)}>test</button>
                </TabPanel>
            </TabContent>
        </Tabs>
    );
};

export default Functions;

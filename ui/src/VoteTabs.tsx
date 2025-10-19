import { Box, Tab, Tabs } from '@mui/material';
import { useEffect, useState } from 'react';
import { TabContent } from './TabContent';
import type { config, votes } from './types';
import { VoteBox } from './VoteBox';
import toast from 'react-hot-toast';

export const VoteTabs = () => {
    const [tab, setTab] = useState('');
    const [tabs, setTabs] = useState<string[]>([]);
    const [config, setConfig] = useState<config>({});
    const [votes, setVotes] = useState<votes>({});
    useEffect(() => {
        const votes: votes = Object.fromEntries(
            Object.entries(config).map(([category, { images }]) => {
                const numbers = [];
                for (let i = 1; i <= images; i++) {
                    numbers.push(i);
                }
                // shuffle
                for (let i = numbers.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
                }
                return [category, numbers];
            })
        );
        setVotes(votes);
    }, [config]);
    useEffect(() => {
        fetch('config/config.json')
            .then((r) => r.json())
            .then((j) => {
                setConfig(j);
                const keys = Object.keys(j);
                if (!keys.length) {
                    return;
                }
                setTabs(keys);
                setTab(keys[0]);
            })
            .catch((e) => {
                toast.error('Failed to load the main config!');
                console.log(e);
            });
    }, []);
    return (
        <Box display='flex' flexDirection='column' gap={2} alignItems='center'>
            <Tabs value={tab} onChange={(_, t) => setTab(t)}>
                {tabs.map((t) => (
                    <Tab value={t} label={t} key={t} />
                ))}
            </Tabs>
            {tabs.map((t) => (
                <TabContent
                    tab={t}
                    key={t}
                    display={t === tab ? 'flex' : 'none'}
                    setVotes={(votes: number[]) =>
                        setVotes((v) => ({ ...v, [t]: votes }))
                    }
                    votes={votes[t] || []}
                />
            ))}
            <VoteBox votes={votes} />
        </Box>
    );
};

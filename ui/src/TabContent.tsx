import { Box, Typography, type BoxProps } from '@mui/material';
import { Flipped, Flipper } from 'react-flip-toolkit';
import { ImageCard } from './ImageCard';

export const TabContent = ({
    tab,
    votes,
    setVotes,
    ...props
}: BoxProps & {
    tab: string;
    votes: number[];
    setVotes: (votes: number[]) => void;
}) => {
    const setPos = (idx: number, to: string) => {
        const before = votes.slice(0, idx);
        const after = votes.slice(idx + 1);
        const elem = votes[idx];
        switch (to) {
            case 'first':
                setVotes([elem, ...before, ...after]);
                return;
            case 'last':
                setVotes([...before, ...after, elem]);
                return;
            case 'up':
                setVotes([
                    ...before.slice(0, -1),
                    elem,
                    ...before.slice(-1),
                    ...after,
                ]);
                return;
            case 'down':
                setVotes([
                    ...before,
                    ...after.slice(0, 1),
                    elem,
                    ...after.slice(1),
                ]);
                return;
        }
    };
    return (
        <Box display='flex' flexDirection='column' {...props}>
            <Typography variant='h5' mb={2}>
                Vote for {tab} images
            </Typography>
            <Flipper flipKey={votes.join(',')}>
                {votes.map((n, idx) => (
                    <Flipped flipId={n} key={n}>
                        <ImageCard
                            category={tab}
                            number={n}
                            idx={
                                idx === 0
                                    ? '1 (best)'
                                    : idx === votes.length - 1
                                    ? `${idx + 1} (worst)`
                                    : '' + (idx + 1)
                            }
                            setPos={(to: string) => setPos(idx, to)}
                        />
                    </Flipped>
                ))}
            </Flipper>
        </Box>
    );
};

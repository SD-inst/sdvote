import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from '@mui/material';
import { useState } from 'react';
import toast from 'react-hot-toast';
import type { votes } from './types';

export const VoteBox = ({ votes }: { votes: votes }) => {
    const [token, setToken] = useState('');
    const [confirm, setConfirm] = useState(false);
    const handleVote = () => {
        setConfirm(false);
        fetch('api/submit', {
            method: 'POST',
            body: JSON.stringify({ token, votes }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then((r) => {
                if (r.ok) {
                    setToken('');
                    toast.success('Vote submitted, thank you!');
                } else {
                    r.json()
                        .then((t) =>
                            toast.error('Error submitting vote: ' + t.message)
                        )
                        .catch((e) => {
                            toast.error('Error decoding JSON while submitting vote: ' + e);
                        });
                }
            })
            .catch((e) => {
                toast.error('Error submitting vote: ' + e);
            });
    };
    return (
        <Box display='flex' gap={2} alignItems='center' mb={5} mt={5}>
            <TextField
                size='small'
                placeholder='Voting code'
                value={token}
                onChange={(e) => setToken(e.target.value)}
            />
            <Button
                color='warning'
                variant='contained'
                onClick={() => setConfirm(true)}
                disabled={!token}
            >
                VOOOOOOOTE
            </Button>
            <Dialog open={confirm} onClose={() => setConfirm(false)}>
                <DialogTitle>Confirm your vote</DialogTitle>
                <DialogContent>
                    Are you sure you want to submit your vote? You can only do
                    it once!
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleVote}>OK</Button>
                    <Button onClick={() => setConfirm(false)}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

import {
    KeyboardArrowDown,
    KeyboardArrowUp,
    KeyboardDoubleArrowDown,
    KeyboardDoubleArrowUp,
} from '@mui/icons-material';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Typography,
    type ButtonProps,
} from '@mui/material';
import { useRef, useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/plugins/counter.css';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';

const ActionButton = ({ ...props }: ButtonProps) => (
    <Button size='small' variant='outlined' {...props}>
        {props.children}
    </Button>
);

export const ImageCard = ({
    category,
    number,
    idx,
    setPos,
    ...props
}: {
    number: number;
    idx: string;
    category: string;
    setPos: (pos: string) => void;
}) => {
    const ref = useRef<HTMLImageElement>(null);
    const [open, setOpen] = useState(false);
    const url = `images/${category}/${number}.jpg`;
    return (
        <>
            <Card ref={ref} sx={{ width: '100%' }} {...props}>
                <CardContent>
                    <Typography variant='h6'>{idx}</Typography>
                    <img
                        src={url}
                        style={{
                            maxHeight: 400,
                            maxWidth: '100%',
                            cursor: 'pointer',
                        }}
                        onClick={() => {
                            setOpen(true);
                        }}
                    />
                </CardContent>
                <CardActions sx={{ justifyContent: 'center' }}>
                    <ActionButton onClick={() => setPos('first')}>
                        <KeyboardDoubleArrowUp />
                    </ActionButton>
                    <ActionButton onClick={() => setPos('up')}>
                        <KeyboardArrowUp />
                    </ActionButton>
                    <ActionButton onClick={() => setPos('down')}>
                        <KeyboardArrowDown />
                    </ActionButton>
                    <ActionButton onClick={() => setPos('last')}>
                        <KeyboardDoubleArrowDown />
                    </ActionButton>
                </CardActions>
            </Card>
            <Lightbox
                open={open}
                close={() => setOpen(false)}
                slides={[{ src: url }]}
                plugins={[Zoom, Fullscreen]}
                render={{ buttonPrev: () => null, buttonNext: () => null }}
                zoom={{ scrollToZoom: true, maxZoomPixelRatio: 5 }}
                controller={{
                    closeOnBackdropClick: true,
                }}
            />
        </>
    );
};

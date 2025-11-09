import * as React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Rating,
    Box,
    Typography,
    TextField,
    Fade,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import SendIcon from '@mui/icons-material/Send';
import { useCallback, useState } from 'react';
import { CustomerRatingAPI } from "../../api/endpoints";

const labels = {
    0.5: 'Useless',
    1: 'Useless+',
    1.5: 'Poor',
    2: 'Poor+',
    2.5: 'Ok',
    3: 'Ok+',
    3.5: 'Good',
    4: 'Good+',
    4.5: 'Excellent',
    5: 'Excellent+',
};

function getLabelText(value) {
    return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
}

export default function RatingDialog({ open, onClose }) {
    const [value, setValue] = useState(2);
    const [hover, setHover] = useState(-1);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showComment, setShowComment] = useState(false);
    const [submissionSuccess, setSubmissionSuccess] = useState(false);

    const handleRatingSelect = (newValue) => {
        if (newValue !== null) {
            setValue(newValue);
            setShowComment(true);
        }
    };

    const handleSubmitFeedback = useCallback(async () => {
        setIsSubmitting(true);
        try {
            console.log("Submitting rating:", value, "with comment:", comment);
            await CustomerRatingAPI(value, comment);

            setSubmissionSuccess(true);

            // Close dialog after showing success message
            setTimeout(() => {
                onClose();
                // Reset state after closing
                setTimeout(() => {
                    setValue(2);
                    setComment('');
                    setShowComment(false);
                    setSubmissionSuccess(false);
                }, 300);
            }, 1500);
        } catch (error) {
            console.error("Rating submission failed in component.");
            setIsSubmitting(false);
        }
    }, [value, comment, onClose]);

    const handleClose = () => {
        if (!isSubmitting) {
            onClose();
            // Reset state after closing
            setTimeout(() => {
                setValue(2);
                setComment('');
                setShowComment(false);
                setSubmissionSuccess(false);
            }, 300);
        }
    };

    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    backgroundColor: '#ffffff',
                    color: '#003d5c',
                    borderRadius: 3,
                    boxShadow: '0 12px 40px rgba(0, 61, 92, 0.2)',
                    mx: 2,
                }
            }}
        >
            <DialogTitle
                sx={{
                    backgroundColor: '#003d5c',
                    color: '#ffffff',
                    textAlign: 'center',
                    fontSize: { xs: '1.25rem', sm: '1.5rem' },
                    fontWeight: 600,
                    py: { xs: 2, sm: 3 },
                    px: { xs: 2, sm: 3 },
                }}
            >
                {submissionSuccess ? 'Thank You!' : 'How was your experience?'}
            </DialogTitle>

            <DialogContent sx={{ py: { xs: 3, sm: 4 }, px: { xs: 2, sm: 3 } }}>
                {submissionSuccess ? (
                    <Fade in={submissionSuccess}>
                        <Box
                            sx={{
                                textAlign: 'center',
                                py: 3,
                            }}
                        >
                            <Box
                                sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: '50%',
                                    backgroundColor: '#28a745',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 20px',
                                    animation: 'scaleIn 0.5s ease-out',
                                    '@keyframes scaleIn': {
                                        '0%': { transform: 'scale(0)' },
                                        '50%': { transform: 'scale(1.1)' },
                                        '100%': { transform: 'scale(1)' },
                                    },
                                }}
                            >
                                <Box
                                    component="span"
                                    sx={{
                                        color: '#ffffff',
                                        fontSize: '3rem',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    ✓
                                </Box>
                            </Box>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: '#003d5c',
                                    fontWeight: 600,
                                    mb: 1,
                                }}
                            >
                                Feedback Submitted!
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: '#666',
                                }}
                            >
                                We appreciate your valuable feedback
                            </Typography>
                        </Box>
                    </Fade>
                ) : (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: { xs: 2, sm: 3 },
                        }}
                    >
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: '#666',
                                    fontSize: { xs: '0.9rem', sm: '1rem' },
                                    mb: 2,
                                }}
                            >
                                We'd love to hear your feedback!
                            </Typography>

                            <Rating
                                name="hover-feedback"
                                value={value}
                                precision={0.5}
                                getLabelText={getLabelText}
                                onChange={(event, newValue) => {
                                    handleRatingSelect(newValue);
                                }}
                                onChangeActive={(event, newHover) => {
                                    setHover(newHover);
                                }}
                                disabled={isSubmitting}
                                size="large"
                                emptyIcon={<StarIcon style={{ opacity: 0.3, color: '#d0d0d0' }} fontSize="inherit" />}
                                sx={{
                                    fontSize: { xs: '2.5rem', sm: '3.5rem' },
                                    '& .MuiRating-icon': {
                                        mx: { xs: 0.25, sm: 0.5 },
                                    },
                                    '& .MuiRating-iconFilled': {
                                        color: '#FFB800',
                                        filter: 'drop-shadow(0 2px 4px rgba(255, 184, 0, 0.3))',
                                    },
                                    '& .MuiRating-iconHover': {
                                        color: '#FFC933',
                                        transform: 'scale(1.1)',
                                        transition: 'transform 0.2s ease-in-out',
                                    },
                                }}
                            />

                            {value !== null && (
                                <Box
                                    sx={{
                                        fontSize: { xs: '1.1rem', sm: '1.3rem' },
                                        fontWeight: 600,
                                        color: '#003d5c',
                                        mt: 2,
                                        minHeight: '32px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {labels[hover !== -1 ? hover : value]}
                                </Box>
                            )}
                        </Box>

                        <Fade in={showComment}>
                            <Box>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    placeholder="Tell us more about your experience... (Optional)"
                                    value={comment}
                                    onChange={handleCommentChange}
                                    disabled={isSubmitting}
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: '#f8f9fa',
                                            '& fieldset': {
                                                borderColor: '#d0d0d0',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#003d5c',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#003d5c',
                                            },
                                        },
                                        '& .MuiOutlinedInput-input': {
                                            fontSize: { xs: '0.9rem', sm: '1rem' },
                                            color: '#333',
                                        },
                                    }}
                                />
                            </Box>
                        </Fade>

                        {showComment && (
                            <Fade in={showComment}>
                                <Button
                                    onClick={handleSubmitFeedback}
                                    disabled={isSubmitting}
                                    variant="contained"
                                    fullWidth
                                    startIcon={isSubmitting ? null : <SendIcon />}
                                    sx={{
                                        backgroundColor: '#003d5c',
                                        color: '#ffffff',
                                        textTransform: 'none',
                                        fontSize: { xs: '0.95rem', sm: '1.05rem' },
                                        fontWeight: 600,
                                        py: { xs: 1.5, sm: 1.75 },
                                        borderRadius: 2,
                                        mt: 1,
                                        '&:hover': {
                                            backgroundColor: '#00293d',
                                        },
                                        '&:disabled': {
                                            backgroundColor: '#cccccc',
                                            color: '#666',
                                        }
                                    }}
                                >
                                    {isSubmitting ? (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box
                                                component="span"
                                                sx={{
                                                    width: 20,
                                                    height: 20,
                                                    border: '2px solid #ffffff',
                                                    borderTopColor: 'transparent',
                                                    borderRadius: '50%',
                                                    animation: 'spin 0.8s linear infinite',
                                                    '@keyframes spin': {
                                                        '0%': { transform: 'rotate(0deg)' },
                                                        '100%': { transform: 'rotate(360deg)' },
                                                    },
                                                }}
                                            />
                                            Submitting...
                                        </Box>
                                    ) : (
                                        'Submit Feedback'
                                    )}
                                </Button>
                            </Fade>
                        )}
                    </Box>
                )}
            </DialogContent>

            {!submissionSuccess && (
                <DialogActions
                    sx={{
                        backgroundColor: '#f8f9fa',
                        borderTop: '1px solid #e0e0e0',
                        px: { xs: 2, sm: 3 },
                        py: { xs: 1.5, sm: 2 },
                        justifyContent: 'center',
                    }}
                >
                    <Button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        variant="text"
                        sx={{
                            color: '#666',
                            textTransform: 'none',
                            fontSize: { xs: '0.9rem', sm: '0.95rem' },
                            fontWeight: 500,
                            py: { xs: 1, sm: 1.25 },
                            px: { xs: 2, sm: 3 },
                            '&:hover': {
                                backgroundColor: 'rgba(0, 61, 92, 0.05)',
                                color: '#003d5c',
                            },
                            '&:disabled': {
                                color: '#999',
                            }
                        }}
                    >
                        Maybe Later
                    </Button>
                </DialogActions>
            )}
        </Dialog>
    );
}
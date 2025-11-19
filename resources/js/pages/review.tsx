

import { useState } from 'react'
import { router, usePage } from '@inertiajs/react'
import useTranslation from '@/Hooks/useTranslation';

export default function Review({ role, appointment_id }: any){
    const page = usePage<any>();
    const serverRole = page.props.role || role || 'Buyer';
    const appointmentId = page.props.appointment_id || appointment_id;

    const [rating, setRating] = useState<number>(0);
    const [hover, setHover] = useState<number>(0);
    const [comment, setComment] = useState<string>('');

    const submitReview = () => {
        if (rating < 1) {
            alert('Please select a rating.');
            return;
        }
        if (!appointmentId) {
            alert('No appointment found for review. Please complete a transaction first or contact support.');
            return;
        }
        const getLocale = () => {
            const path = typeof window !== 'undefined' ? window.location.pathname : '';
            const match = path.match(/^\/([a-z]{2})\//);
            return match ? match[1] : 'id';
        };
        const locale = getLocale();
        const reviewRoute = serverRole === 'Seller' ? `/${locale}/Seller/review` : `/${locale}/Buyer/review`;
        router.post(reviewRoute, {
            appointment_id: appointmentId,
            rating,
            comment,
        }, {
            onSuccess: () => {
                alert('Thank you for your review!');
            },
            onError: () => alert('Failed to submit review.')
        });
    }

    const {t} = useTranslation()

    return(
        <>
            <div className="w-full h-screen flex justify-center items-center bg-[#ECEEDF]">
                <div className="flex flex-col items-center justify-start w-[700px] h-[700px] bg-white border-2 gap-10 px-15">
                    <div className="flex pt-15 gap-4 w-full justify-start items-start">
                        <img src="/review.png" alt="review" className="w-[40px] h-[40px]"/>
                        <h1 className="text-[28px]">Rating</h1>
                    </div>
                    <div className="flex flex-col gap-3">
                        <h1 className="text-[26px]">{serverRole === "Buyer" ? (
                            t("HowB")
                        ): (
                            t("HowS")
                        )}</h1>
                        <div className="flex gap-2 text-4xl">
                            {[1,2,3,4,5].map((star) => (
                                <button
                                    key={star}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                    onClick={() => setRating(star)}
                                    aria-label={`rate-${star}`}
                                    className={(hover || rating) >= star ? 'text-yellow-400' : 'text-gray-300'}
                                >
                                    {(hover || rating) >= star ? '★' : '☆'}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <h1 className="text-[26px]">{serverRole === "Buyer" ? (
                            t("thinkB")
                        ): (
                            t("thinkS")
                        )}</h1>
                        <div>
                            <textarea
                                className="w-full h-40 border-2  rounded-lg p-3"
                                placeholder="Type Here..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="px-15 bg-[#BBDCE5] w-[510px] h-[47px] flex justify-center items-center rounded-2xl cursor-pointer" onClick={submitReview}>
                        <button className="text-[28px] cursor-pointer">Submit</button>
                    </div>
                </div>
            </div>
        </>

    )
}

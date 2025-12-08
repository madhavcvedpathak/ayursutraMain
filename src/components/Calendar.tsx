import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isBefore, startOfDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface CalendarProps {
    selectedDate: Date | null;
    onSelectDate: (date: Date) => void;
    availableDates?: Date[]; // Optional: for future backend integration
}

export const Calendar = ({ selectedDate, onSelectDate }: CalendarProps) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const today = startOfDay(new Date());

    // Generate days for the grid
    const days = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
    });

    // Mock "Best Muhurat" calculation (e.g., usually Mondays/Thursdays or random for demo)
    const isBestMuhurat = (date: Date) => {
        const day = date.getDay();
        return day === 1 || day === 4; // Mon & Thu
    };

    return (
        <div className="premium-card bg-white p-6">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-serif font-semibold text-brand-deep">
                    {format(currentMonth, 'MMMM yyyy')}
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                        disabled={isBefore(endOfMonth(subMonths(currentMonth, 1)), today)}
                        className="rounded-full p-2 hover:bg-brand-sage disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                        <ChevronLeft size={20} className="text-brand-deep" />
                    </button>
                    <button
                        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                        className="rounded-full p-2 hover:bg-brand-sage"
                    >
                        <ChevronRight size={20} className="text-brand-deep" />
                    </button>
                </div>
            </div>

            {/* Weekdays */}
            <div className="mb-2 grid grid-cols-7 text-center">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="text-xs font-medium uppercase tracking-wider text-brand-muted">
                        {day}
                    </div>
                ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-2">
                {/* Empty slots for start of month offset, if needed (simplified here) */}
                {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => (
                    <div key={`empty-${i}`} />
                ))}

                {days.map((date, i) => {
                    const isDisabled = isBefore(date, today);
                    const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
                    const isMuhurat = !isDisabled && isBestMuhurat(date);

                    return (
                        <motion.button
                            key={i}
                            whileHover={!isDisabled ? { scale: 1.1 } : {}}
                            whileTap={!isDisabled ? { scale: 0.95 } : {}}
                            onClick={() => !isDisabled && onSelectDate(date)}
                            disabled={isDisabled}
                            className={`
                                relative flex h-10 w-10 items-center justify-center rounded-full text-sm transition-colors
                                ${isDisabled ? 'text-gray-300 cursor-not-allowed' : 'text-brand-deep hover:bg-brand-sage cursor-pointer'}
                                ${isSelected ? 'bg-brand-ocean text-white shadow-brand hover:bg-brand-ocean' : ''}
                                ${!isSelected && isMuhurat ? 'ring-1 ring-brand-teal/30 bg-brand-cream' : ''}
                            `}
                        >
                            {format(date, 'd')}

                            {/* Best Muhurat Indicator */}
                            {!isSelected && isMuhurat && (
                                <div className="absolute -bottom-1 h-1 w-1 rounded-full bg-brand-teal"></div>
                            )}

                            {/* Selected Indicator */}
                            {isSelected && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-teal text-white border border-white"
                                >
                                    <Check size={10} />
                                </motion.div>
                            )}
                        </motion.button>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="mt-6 flex items-center gap-4 text-xs text-brand-muted">
                <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full ring-1 ring-brand-teal/30 bg-brand-cream"></div>
                    <span>Best Muhurat</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-brand-ocean"></div>
                    <span>Selected</span>
                </div>
            </div>
        </div>
    );
};

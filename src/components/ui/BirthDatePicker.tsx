'use client';

import { useRef } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ru } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

registerLocale('ru', ru);

interface BirthDatePickerProps {
    selected: Date | undefined;
    onSelect: (date: Date | undefined) => void;
}

const BirthDatePicker = ({ selected, onSelect }: BirthDatePickerProps) => {
    const pickerRef = useRef<DatePicker>(null);

    return (
        <div className="relative w-full">
            <DatePicker
                ref={pickerRef}
                selected={selected}
                onChange={(date: Date | null) => onSelect(date ?? undefined)}
                locale="ru"
                dateFormat="dd.MM.yyyy"
                maxDate={new Date()}
                minDate={new Date(1990, 0)}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                yearDropdownItemNumber={40}
                scrollableYearDropdown
                customInput={(
                    <Button
                        variant="bordered"
                        color="default"
                        className="w-full justify-start text-left font-normal h-10"
                        type="button"
                    >
                        <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                        <span className="truncate">
                            {selected
                                ? selected.toLocaleDateString('ru-RU')
                                : 'Выберите дату'}
                        </span>
                    </Button>
                )}
                popperClassName="z-[100]"
                calendarClassName="custom-datepicker"
                wrapperClassName="w-full"
                popperPlacement="bottom-start"
                showPopperArrow={false}
            />
        </div>
    );
};

export default BirthDatePicker;
import { Listbox } from '@headlessui/react';
import { Fragment } from 'react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

type CustomSelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
};

const CustomSelect = ({
  label,
  value,
  onChange,
  options,
}: CustomSelectProps) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>

      <Listbox value={value} onChange={onChange}>
        <div className="relative text-[12px]">
          {/* Select Button */}
          <Listbox.Button className="relative w-full cursor-pointer rounded-md bg-transparent border border-gray-300 py-3 pl-4 pr-10 text-left text-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3D7068]">
            <span className="block truncate">{value}</span>
            <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-300"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>

          {/* Options */}
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-[#1f1f1f] py-1 text-base shadow-lg focus:outline-none sm:text-sm z-20 list-none">
            {options.map((option) => (
              <Listbox.Option key={option} value={option} as={Fragment}>
                {({ active, selected }) => (
                  <div
                    className={`select-none relative py-2 pl-10 pr-4 ${
                      active ? 'bg-[#3D7068] text-white' : 'text-gray-300'
                    }`}
                  >
                    <span
                      className={`${
                        selected ? 'font-medium' : 'font-normal'
                      } block truncate`}
                    >
                      {option}
                    </span>
                    {selected && (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
};

export default CustomSelect;

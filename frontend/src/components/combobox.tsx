/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "components/ui/button";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "components/ui/command";
import { FormItem, FormMessage } from "components/ui/form";
import { Popover, PopoverTrigger, PopoverContent } from "components/ui/popover";
import { cn } from "lib/utils";
import { ChevronsUpDown, Check } from "lucide-react";
import { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";

type ComboBoxFieldProps<T extends Record<string, any>> = {
  name: string;
  options: T[];
  labelKey?: string;
  valueKey?: string;
  placeholder?: string;
  width?: string;
  className?: string;
  displayTransform?: (label: string) => string;
};

export function ComboBox<T extends Record<string, any>>({
  name,
  options,
  labelKey = "label",
  valueKey = "value",
  placeholder = "Select an option",
  width = "w-[200px]",
  className,
  displayTransform,
}: ComboBoxFieldProps<T>) {
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const selected = options.find((item) => item[valueKey] === field.value);
        const selectedLabel = selected?.[labelKey] ?? "";
        const displayText =
          displayTransform?.(selectedLabel) ?? (selectedLabel || placeholder);

        return (
          <FormItem
            className={cn("flex flex-col items-start gap-2", className)}
          >
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn("justify-between", width)}
                >
                  {displayText}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className={cn("p-0", width)}>
                <Command>
                  <CommandInput placeholder="Search..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>No result found.</CommandEmpty>
                    <CommandGroup>
                      {options.map((item) => {
                        const label = item[labelKey];
                        const value = item[valueKey];
                        return (
                          <CommandItem
                            key={value}
                            value={value}
                            onSelect={(currentValue) => {
                              field.onChange(
                                currentValue === field.value
                                  ? ""
                                  : currentValue,
                              );
                              setOpen(false);
                            }}
                          >
                            {label}
                            <Check
                              className={cn(
                                "ml-auto",
                                field.value === value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

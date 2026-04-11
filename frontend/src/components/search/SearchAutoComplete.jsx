import { useId, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { Input, Button } from "../../components/ui";
import { useSearchSuggestions } from "../../hooks/useSearchSuggestions";
import { getVideoSuggestions } from "../../apis/video.api";

export function SearchAutocomplete({
    value,
    onChange,
    onSubmit,
    placeholder = "Search...",
}) {
    const inputId = useId();
    const listboxId = useId();
    const wrapperRef = useRef(null);

    const [activeIndex, setActiveIndex] = useState(-1);

    const {
        suggestions,
        loading,
        error,
        isOpen,
        setIsOpen,
        clearSuggestions,
    } = useSearchSuggestions({
        query: value,
        fetchSuggestions: getVideoSuggestions,
        delay: 300,
        minLength: 1,
    });

    const handleSelect = (title) => {
        onChange(title);
        clearSuggestions();
        onSubmit(title);
    };

    const handleKeyDown = (e) => {
        if (!isOpen || suggestions.length === 0) {
            if (e.key === "Enter") {
                e.preventDefault();
                onSubmit(value);
            }
            return;
        }

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((prev) =>
                prev < suggestions.length - 1 ? prev + 1 : 0
            );
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((prev) =>
                prev > 0 ? prev - 1 : suggestions.length - 1
            );
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (activeIndex >= 0 && suggestions[activeIndex]) {
                handleSelect(suggestions[activeIndex].title);
            } else {
                onSubmit(value);
                clearSuggestions();
            }
        } else if (e.key === "Escape") {
            e.preventDefault();
            clearSuggestions();
            setActiveIndex(-1);
        }
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <label htmlFor={inputId} className="sr-only">
                Search videos
            </label>

            <div className="flex items-center gap-2 w-full">
                <Input
                    id={inputId}
                    type="text"
                    value={value}
                    onChange={(e) => {
                        onChange(e.target.value);
                        setActiveIndex(-1);
                    }}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                        if (suggestions.length > 0 || loading || error) {
                            setIsOpen(true);
                        }
                    }}
                    placeholder={placeholder}
                    autoComplete="off"
                    role="combobox"
                    aria-autocomplete="list"
                    aria-expanded={isOpen}
                    aria-controls={listboxId}
                    aria-activedescendant={
                        activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
                    }
                />

                {value ? (
                    <Button
                        type="button"
                        variant="ghost"
                        aria-label="Clear search"
                        onClick={() => {
                            onChange("");
                            setActiveIndex(-1);
                            clearSuggestions();
                        }}
                    >
                        <X size={16} />
                    </Button>
                ) : null}

                <Button
                    type="button"
                    aria-label="Search"
                    onClick={() => {
                        onSubmit(value);
                        clearSuggestions();
                    }}
                >
                    <Search size={16} />
                </Button>
            </div>

            {isOpen && (
                <div
                    id={listboxId}
                    role="listbox"
                    className="absolute z-50 mt-2 w-full rounded-lg border border-(--border) bg-(--surface) shadow-lg max-h-80 overflow-auto"
                >
                    {loading && (
                        <div className="px-3 py-2 text-sm text-(--muted)">
                            Loading suggestions...
                        </div>
                    )}

                    {!loading && error && (
                        <div className="px-3 py-2 text-sm text-red-500">
                            {error}
                        </div>
                    )}

                    {!loading && !error && suggestions.length === 0 && value.trim() && (
                        <div className="px-3 py-2 text-sm text-(--muted)">
                            No suggestions found
                        </div>
                    )}

                    {!loading &&
                        !error &&
                        suggestions.map((item, index) => (
                            <button
                                key={item._id}
                                id={`${listboxId}-option-${index}`}
                                role="option"
                                aria-selected={activeIndex === index}
                                type="button"
                                className={`w-full text-left px-3 py-2 text-sm transition ${activeIndex === index
                                        ? "bg-(--surface2)"
                                        : "hover:bg-(--surface2)"
                                    }`}
                                onMouseEnter={() => setActiveIndex(index)}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => handleSelect(item.title)}
                            >
                                {item.title}
                            </button>
                        ))}
                </div>
            )}
        </div>
    );
}

import React from 'react';
import Select from 'react-select';
import { FaPython, FaJava } from 'react-icons/fa';
import { SiC } from 'react-icons/si';
import '../../../scss/Components/CodeArena/LanguageDropdown.scss';

const LanguageDropdown = ({ language, setLanguage }) => {
    const languageOptions = [
        { value: 'Python', label: <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaPython /> Python</div> },
        { value: 'Java', label: <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaJava /> Java</div> },
        { value: 'C', label: <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><SiC /> C</div> },
    ];

    // Custom styles for react-select
    const customStyles = {
        control: (provided) => ({
            ...provided,
            backgroundColor: 'var(--bg-medium)', // Custom background color
            border: '1px solid var(--bg-dark)', // Border color
            borderRadius: 'var(--border-radius)', // Border radius
            padding: '0.5rem 0.8rem',
            fontSize: '0.9rem',
            boxShadow: 'var(--shadow-sm)', // Add shadow for depth
            transition: 'all 0.3s ease', // Smooth transition
            '&:hover': {
                borderColor: 'var(--primary-dark)', // Hover border color
            }
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: 'var(--bg-darker)', // Darker background for the dropdown menu
            borderRadius: 'var(--border-radius)',
            boxShadow: 'var(--shadow-md)', // Slightly stronger shadow for the menu
            marginTop: '0.5rem',
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? 'var(--primary-dark)' : 'var(--bg-medium)',
            color: state.isSelected ? 'var(--text-light)' : 'var(--text-muted)',
            padding: '0.75rem',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            '&:hover': {
                backgroundColor: 'var(--bg-light)', // Hover effect
                color: 'var(--text-light)',
                cursor: 'pointer',
            },
        }),
        singleValue: (provided) => ({
            ...provided,
            color: 'var(--text-light)', // Text color for selected value
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
        }),
        indicatorSeparator: (provided) => ({
            ...provided,
            display: 'none', // Remove the indicator separator
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            color: 'var(--text-muted)', // Color for the dropdown arrow indicator
        }),
    };

    return (
        <div className="language-dropdown-container">
            <label className="dropdown-label">
                <span className="dropdown-label-text">Language:</span>
                <Select
                    className="language-select"
                    value={languageOptions.find(opt => opt.value === language)}
                    onChange={(selected) => setLanguage(selected.value)}
                    options={languageOptions}
                    isSearchable={false}
                    styles={customStyles} // Applying custom styles to react-select
                />
            </label>
        </div>
    );
};

export default LanguageDropdown;

import React from 'react';
import Select from 'react-select';
import { FaPython, FaJava } from 'react-icons/fa';
import { SiC } from 'react-icons/si';

const LanguageDropdown = ({ language, setLanguage }) => {
    const languageOptions = [
        { value: 'Python', label: <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaPython /> Python</div> },
        { value: 'Java', label: <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaJava /> Java</div> },
        { value: 'C', label: <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><SiC /> C</div> },
    ];

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
                    styles={{
                        control: (provided) => ({
                            ...provided,
                            backgroundColor: 'var(--bg-darker)', // Darker background
                            borderColor: 'var(--bg-dark)', // Dark border for a sleek look
                            borderRadius: 'var(--border-radius)',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)', // Darker shadow for depth
                            color: 'var(--text-light)', // Light text on dark background
                            padding: '0.8rem',
                            transition: 'all 0.3s ease-in-out', // Smooth transitions
                        }),
                        menu: (provided) => ({
                            ...provided,
                            backgroundColor: 'var(--bg-darker)', // Darker background for menu
                            color: 'var(--text-light)', // Light text for readability
                            borderRadius: 'var(--border-radius)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.6)', // Stronger shadow
                            marginTop: '0.5rem', // Slight margin to give space
                        }),
                        option: (provided, state) => ({
                            ...provided,
                            backgroundColor: state.isSelected ? 'var(--primary-dark)' : 'var(--bg-dark)', // Highlight selected option
                            color: state.isSelected ? 'var(--text-light)' : 'var(--text-muted)', // Change text color based on selection
                            fontSize: '0.9rem',
                            padding: '1rem',
                            '&:hover': {
                                backgroundColor: 'var(--primary-dark)', // Hover effect
                                color: 'var(--text-light)', // Hover text color
                                cursor: 'pointer', // Pointer cursor on hover
                            },
                        }),
                    }}
                />
            </label>
        </div>
    );
};

export default LanguageDropdown;

export default function InputField({ id, label, type = "text", value, onChange, placeholder, error, icon }) {

    return (
      <div className="form-group">
        <label htmlFor={id}>{label}</label>
        <div className="input-wrapper">
        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
          <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required
          />
        </div>
        {error && <div className="error-message">{error}</div>}
      </div>
    );
  }
  
export default function EightSectionContactForm() {
  return (
    <div className="contactformsection-bottom-form-section">
      <div className="contactformsection-bottom-form">
        <form className="contact-form">
          <div className="form-row">
            <div className="form-group first-name">
              <label htmlFor="firstname" className="form-label ">
                First Name
              </label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                className="form-input"
                // value={formData.firstname}
                // onChange={handleChange}
                required
              />
            </div>
            <div className="form-group last-name">
              <label htmlFor="lastname" className="form-label ">
                Last Name
              </label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                className="form-input"
                // value={formData.lastname}
                // onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group email">
              <label htmlFor="email" className="form-label ">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                // value={formData.email}
                // onChange={handleChange}
                required
              />
            </div>
            <div className="form-group phone">
              <label htmlFor="phone" className="form-label ">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="form-input"
                // value={formData.phone}
                // onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group company">
              <label htmlFor="company" className="form-label ">
                Company Name
              </label>
              <input
                type="text"
                id="company"
                name="company"
                className="form-input"
                // value={formData.company}
                // onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group subject full-width">
              <label htmlFor="subject" className="form-label ">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="form-input"
                // value={formData.subject}
                // onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group message full-width">
              <label htmlFor="message" className="form-label ">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                className="form-textarea"
                // value={formData.message}
                // onChange={handleChange}
                required
              ></textarea>
            </div>
          </div>

          <div className="form-row button-row">
            <button type="submit" className="form-submit-button">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

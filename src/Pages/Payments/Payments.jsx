import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BsCheckCircleFill, BsCreditCard2Front } from "react-icons/bs";
import "./Payments.css";

function Payments() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const plan = state?.plan || { name: "Premium Plus", price: "$99.99", period: "year", trial: true };
  const [isOverWhite, setIsOverWhite] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsOverWhite(window.scrollY > 250);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [form, setForm] = useState({ name: "", number: "", expiry: "", cvc: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formatted = value;

    if (name === "number") {
      formatted = value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    }
    if (name === "expiry") {
      formatted = value
        .replace(/\D/g, "")
        .slice(0, 4)
        .replace(/^(\d{2})(\d)/, "$1/$2");
    }
    if (name === "cvc") {
      formatted = value.replace(/\D/g, "").slice(0, 4);
    }

    setForm((prev) => ({ ...prev, [name]: formatted }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name on card is required.";
    const digits = form.number.replace(/\s/g, "");
    if (digits.length < 16) newErrors.number = "Enter a valid 16-digit card number.";
    if (!/^\d{2}\/\d{2}$/.test(form.expiry)) newErrors.expiry = "Use MM/YY format.";
    if (form.cvc.length < 3) newErrors.cvc = "CVC must be 3–4 digits.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    localStorage.setItem("subscriptionPlan", plan.name);
    setSubmissionError(false);
    setSubmitted(true);
    setTimeout(() => navigate("/for-you"), 1400);
  };

  if (submitted) {
    return (
      <div className="payments__success-screen">
        <BsCheckCircleFill className="payments__success-icon" />
        <h2 className="payments__success-title">You're all set!</h2>
        <p className="payments__success-sub">Your {plan.name} plan is now active. Redirecting you...</p>
      </div>
    );
  }

  return (
    <div className="payments__page">
      <div className="payments__container">
        <h1 className="payments__page-title">Complete your purchase</h1>
        
        <button className={`payments__back${isOverWhite ? " payments__back--over-white" : ""}`} type="button" onClick={() => navigate("/choose-plan")}>
          ← Back to plans
        </button>

        <div className="payments__layout">
          {/* Order summary */}
          <div className="payments__summary">
            <h2 className="payments__summary-title">Order summary</h2>
            <div className="payments__summary-card">
              <div className="payments__summary-row">
                <span className="payments__summary-plan">{plan.name}</span>
                <span className="payments__summary-price">{plan.price}<span className="payments__summary-period">/{plan.period}</span></span>
              </div>
              {plan.trial && (
                <p className="payments__summary-trial">
                  <BsCheckCircleFill style={{ color: "#2bd97c", marginRight: 6 }} />
                  Includes 7-day free trial
                </p>
              )}
              <hr className="payments__summary-divider" />
              <div className="payments__summary-row payments__summary-row--total">
                <span>Due today</span>
                <span>{plan.trial ? "$0.00" : plan.price}</span>
              </div>
              {plan.trial && (
                <p className="payments__summary-after">
                  {plan.price}/{plan.period} after your trial ends. Cancel anytime.
                </p>
              )}
            </div>

            <ul className="payments__perks">
              <li><BsCheckCircleFill className="payments__perk-check" /> Unlimited access to all books</li>
              <li><BsCheckCircleFill className="payments__perk-check" /> Audio &amp; text summaries</li>
              <li><BsCheckCircleFill className="payments__perk-check" /> Cancel anytime</li>
              <li><BsCheckCircleFill className="payments__perk-check" /> 30-day money-back guarantee</li>
            </ul>
          </div>

          {/* Payment form */}
          <div className="payments__form-wrap">
            <h2 className="payments__form-title">
              <BsCreditCard2Front /> Payment details
            </h2>

            <form className="payments__form" onSubmit={handleSubmit} noValidate>
              <div className="payments__field">
                <label className="payments__label" htmlFor="pay-name">Name on card</label>
                <input
                  id="pay-name"
                  className={`payments__input${errors.name ? " payments__input--error" : ""}`}
                  type="text"
                  name="name"
                  placeholder="Jane Doe"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="cc-name"
                />
                {errors.name && <p className="payments__error">{errors.name}</p>}
              </div>

              <div className="payments__field">
                <label className="payments__label" htmlFor="pay-number">Card number</label>
                <input
                  id="pay-number"
                  className={`payments__input${errors.number ? " payments__input--error" : ""}`}
                  type="text"
                  name="number"
                  placeholder="1234 5678 9012 3456"
                  value={form.number}
                  onChange={handleChange}
                  inputMode="numeric"
                  autoComplete="cc-number"
                />
                {errors.number && <p className="payments__error">{errors.number}</p>}
              </div>

              <div className="payments__field-row">
                <div className="payments__field">
                  <label className="payments__label" htmlFor="pay-expiry">Expiry date</label>
                  <input
                    id="pay-expiry"
                    className={`payments__input${errors.expiry ? " payments__input--error" : ""}`}
                    type="text"
                    name="expiry"
                    placeholder="MM/YY"
                    value={form.expiry}
                    onChange={handleChange}
                    inputMode="numeric"
                    autoComplete="cc-exp"
                  />
                  {errors.expiry && <p className="payments__error">{errors.expiry}</p>}
                </div>

                <div className="payments__field">
                  <label className="payments__label" htmlFor="pay-cvc">CVC</label>
                  <input
                    id="pay-cvc"
                    className={`payments__input${errors.cvc ? " payments__input--error" : ""}`}
                    type="text"
                    name="cvc"
                    placeholder="123"
                    value={form.cvc}
                    onChange={handleChange}
                    inputMode="numeric"
                    autoComplete="cc-csc"
                  />
                  {errors.cvc && <p className="payments__error">{errors.cvc}</p>}
                </div>
              </div>

              <button className="payments__submit" type="submit">
                {plan.trial ? "Start free trial" : `Subscribe for ${plan.price}/${plan.period}`}
              </button>

              {submissionError && (
                <div className="payments__submission-error">
                  <p className="payments__error-message">
                    ⚠️ This payment capability isn't available at the moment. Please try again later.
                  </p>
                </div>
              )}

              <p className="payments__secure-note">
                🔒 Your payment is encrypted and secure. We never store your card details.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payments;

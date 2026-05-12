import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BsCheckCircleFill, BsXCircle, BsChevronDown, BsChevronUp } from "react-icons/bs";
import pricingTop from "../../../assets/pricing-top.png";
import "./ChoosePlan.css";

const FAQS = [
  {
    question: "How does the free trial work?",
    answer: "You get 7 days of full Premium access completely free. We won't charge you until the trial ends, and you can cancel anytime before then.",
  },
  {
    question: "Can I switch plans later?",
    answer: "Yes! You can upgrade or downgrade your plan at any time from your account settings. Changes take effect at the start of your next billing cycle.",
  },
  {
    question: "What happens if I cancel?",
    answer: "If you cancel during the free trial, you won't be charged at all. If you cancel after the trial, you keep access until the end of your current billing period.",
  },
  {
    question: "Is Summarist available on all devices?",
    answer: "Summarist works on any device with a modern web browser — desktop, tablet, or mobile. Offline mode is available on our mobile apps.",
  },
  {
    question: "What books are available?",
    answer: "We have thousands of non-fiction titles across business, self-development, science, history, and more. New summaries are added every week.",
  },
];

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item${open ? " faq-item--open" : ""}`}>
      <button className="faq-item__question" type="button" onClick={() => setOpen((o) => !o)}>
        <span>{question}</span>
        {open ? <BsChevronUp /> : <BsChevronDown />}
      </button>
      {open && <p className="faq-item__answer">{answer}</p>}
    </div>
  );
}

function ChoosePlan() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const fromBookId = state?.fromBookId;
  const [isOverWhite, setIsOverWhite] = useState(false);

  const handleSelectPlan = (plan) => {
    localStorage.setItem("subscriptionPlan", plan.name);
    navigate("/payments", { state: { plan } });
  };

  useEffect(() => {
    const handleScroll = () => {
      // White background starts at ~320px based on the gradient
      setIsOverWhite(window.scrollY > 280);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="choose-plan-page">
      <main className="choose-plan-main">
        <div className="choose-plan">

          <h1 className="choose-plan__title">Get unlimited access to many amazing books to read</h1>
          <p className="choose-plan__subtitle">Turn ordinary moments into amazing learning opportunities</p>

          <div className="choose-plan__hero">
            <img src={pricingTop} alt="Premium books" className="choose-plan__hero-img" />
          </div>

          <div className="choose-plan__features-row">
            <div className="choose-plan__feature-col choose-plan__feature-col--header">
              <p className="choose-plan__feature-label">Features</p>
            </div>
            <div className="choose-plan__feature-col choose-plan__feature-col--free">
              <p className="choose-plan__plan-label">Basic</p>
            </div>
            <div className="choose-plan__feature-col choose-plan__feature-col--premium">
              <p className="choose-plan__plan-label">Premium</p>
            </div>
          </div>

          {[
            "Access to all books",
            "Unlimited listening",
            "Offline mode",
            "Exclusive audio originals",
            "No ads",
          ].map((feat) => (
            <div key={feat} className="choose-plan__feature-row">
              <p className="choose-plan__feature-name">{feat}</p>
              <div className="choose-plan__feature-check">
                {feat === "Access to all books" ? (
                  <BsCheckCircleFill className="cp-check cp-check--yes" />
                ) : (
                  <BsXCircle className="cp-check cp-check--no" />
                )}
              </div>
              <div className="choose-plan__feature-check">
                <BsCheckCircleFill className="cp-check cp-check--yes" />
              </div>
            </div>
          ))}

          <div className="choose-plan__cards">
            <div className="choose-plan__card">
              <div className="choose-plan__card-badge">Most popular</div>
              <h2 className="choose-plan__card-name">Premium Plus</h2>
              <p className="choose-plan__card-price"><span className="choose-plan__price-amount">$99.99</span> / year</p>
              <p className="choose-plan__card-save">Save over 40% vs monthly</p>
              <button className="choose-plan__btn choose-plan__btn--primary" type="button" onClick={() => handleSelectPlan({ name: "Premium Plus", price: "$99.99", period: "year", trial: true })}>
                Start your free 7-day trial
              </button>
              <p className="choose-plan__fine-print">Cancel anytime. $99.99/year after trial.</p>
            </div>

            <div className="choose-plan__card choose-plan__card--secondary">
              <h2 className="choose-plan__card-name">Premium</h2>
              <p className="choose-plan__card-price"><span className="choose-plan__price-amount">$9.99</span> / month</p>
              <button className="choose-plan__btn choose-plan__btn--secondary" type="button" onClick={() => handleSelectPlan({ name: "Premium", price: "$9.99", period: "month", trial: false })}>
                Get started
              </button>
              <p className="choose-plan__fine-print">Cancel anytime. $9.99/month.</p>
            </div>
          </div>

          <p className="choose-plan__guarantee">
            <BsCheckCircleFill style={{ color: "#2bd97c" }} /> 30-day money back guarantee. No questions asked.
          </p>

          <div className="faq-section">
            {FAQS.map((faq) => (
              <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </div>

          <button className={`choose-plan__back${isOverWhite ? " choose-plan__back--over-white" : ""}`} type="button" onClick={() => navigate("/for-you")}>
            ← Back to books
          </button>
        </div>
      </main>

      <footer className="cp-footer">
        <div className="cp-footer__inner">
          <div className="cp-footer__col">
            <h4 className="cp-footer__heading">Actions</h4>
            <ul className="cp-footer__list">
              <li><a href="#">Summarist Magazine</a></li>
              <li><a href="#">Cancel Subscription</a></li>
              <li><a href="#">Help</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>
          <div className="cp-footer__col">
            <h4 className="cp-footer__heading">Useful Links</h4>
            <ul className="cp-footer__list">
              <li><a href="#">Pricing</a></li>
              <li><a href="#">Summarist Business</a></li>
              <li><a href="#">Gift Cards</a></li>
              <li><a href="#">Authors & Publishers</a></li>
            </ul>
          </div>
          <div className="cp-footer__col">
            <h4 className="cp-footer__heading">Company</h4>
            <ul className="cp-footer__list">
              <li><a href="#">About</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Partners</a></li>
              <li><a href="#">Code of Conduct</a></li>
            </ul>
          </div>
          <div className="cp-footer__col">
            <h4 className="cp-footer__heading">Other</h4>
            <ul className="cp-footer__list">
              <li><a href="#">Sitemap</a></li>
              <li><a href="#">Legal Notice</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <p className="cp-footer__copy">© {new Date().getFullYear()} Summarist. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default ChoosePlan;

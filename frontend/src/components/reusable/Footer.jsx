import CompanyTitle from "./CompanyTitle";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faLink } from "@fortawesome/free-solid-svg-icons";

export default function Footer() {
  return (
    <>
      <div id="footer">

        <div className="four-footer-sections">

          <div className="footer-quarter footer-logo">
            <CompanyTitle className="company-title1" />
          </div>
          <div className="footer-quarter">
            <div>
              <h3 className="margin-bottom">About us</h3>
            </div>
            <div className="footer-text">
              <p>
                Adress:{" "}
                <span className="bold">123 Market Street, London, UK</span>
              </p>
              <p>
                Phone: <span className="bold">+44 20 7946 0123</span>
              </p>
              <p>
                Email: <span className="bold">support@mywebshop.com</span>
              </p>
              <p>
                Web: <span className="bold">mywebshop.com</span>
              </p>
              <p>
                Instagram: <span className="bold">@mywebshop</span>
              </p>
              <p>
                X (Twitter): <span className="bold">@mywebshop</span>
              </p>
            </div>
          </div>

          <div className="footer-quarter">
            <div>
              <h3 className="margin-bottom">For customers</h3>
            </div>
            <div className="footer-text">
              <p>
                <a href="/shipping">
                  <span className="visit bold">Shipping Information</span>
                </a>
              </p>
              <p>
                <a href="/returns">
                  <span className="visit bold">Returns & Exchanges</span>
                </a>
              </p>
              <p>
                <a href="/payment-methods">
                  <span className="visit bold">Payment Methods</span>
                </a>
              </p>
              <p>
                <a href="/order-tracking">
                  <span className="visit bold">Order Tracking</span>
                </a>
              </p>
              <p>
                <a href="/support">
                  <span className="visit bold">Customer Support</span>
                </a>
              </p>
              <p>
                <a href="/faqs">
                  <span className="visit bold">FAQs</span>
                </a>
              </p>
            </div>
          </div>
          <div className="footer-quarter">
            <div>
              <h3 className="margin-bottom">Links</h3>
            </div>
            <div className="footer-text">
              <p>
                <a href="/">
                  <span className="visit bold">Home page</span>
                </a>
              </p>
              <p>
                <a href="/login">
                  <span className="visit bold">Log in</span>
                </a>
              </p>
              <p>
                <a href="/signup">
                  <span className="visit bold">Sign up</span>
                </a>
              </p>
              <p>
                <a href="/my-orders">
                  <span className="visit bold">My orders</span>
                </a>
              </p>
              <p>
                <a href="/my-favorites">
                  <span className="visit bold">My favorites</span>
                </a>
              </p>
              <p>
                <a href="/help">
                  <span className="visit bold">Help</span>
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="author copyright">
          &copy; {new Date().getFullYear()} Marina Brezovic
          <div className="social-links">
            <a
              href="https://marina-dev.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Website"
              title="Website"
            >
              <FontAwesomeIcon icon={faLink} />
            </a>
            <a
              href="https://github.com/Flame787"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              title="Github"
            >
              <FontAwesomeIcon icon={faGithub} />
            </a>
            <a
              href="https://www.linkedin.com/in/marina-brezovic-210b583b"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              title="Linkedin"
            >
              <FontAwesomeIcon icon={faLinkedinIn} />
            </a>

            <a
              href="mailto:mbrezovic77@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Email"
              title="Email"
            >
              <FontAwesomeIcon icon={faEnvelope} />
            </a>
          </div>
        </div>
        
      </div>

      {/* <div>Home page</div> */}
      {/* <p>
        Open <Link to="/cart">Cart</Link> to check your Cart items
      </p> */}
    </>
  );
}

import { Link } from "react-router-dom";
import styles from "./NoPage.module.css";
const NoPage = () => {
  return (
    <div>
      <section className={styles.page_404} aria-labelledby="not-found-heading">
        <div className={`${styles.container} text-center`}>
          <h1
            id="not-found-heading"
            className={`${styles._404_Message} text-center`}
          >
            404
          </h1>
          <div className={styles.four_zero_four_bg} aria-hidden="true"></div>

          <div className={styles.contant_box_404}>
            <h2 className="text-2xl font-semibold">
              Look like you&apos;re lost
            </h2>

            <p className="mt-2 text-gray-700">
              the page you are looking for not available!
            </p>

            <Link to="/" className={styles.link_404}>
              Go to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NoPage;

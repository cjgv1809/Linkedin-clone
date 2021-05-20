import React from "react";
import "./Widgets.css";
import InfoIcon from "@material-ui/icons/Info";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import WidgetImg from "../images/widgetImg.jpg";

function Widgets() {
  const newsArticle = (heading, subtitle) => (
    <div className="widgets__article">
      <div className="widgets__articleLeft">
        <FiberManualRecordIcon />
      </div>
      <div className="widgets__articleRight">
        <h4>{heading}</h4>
        <p>{subtitle}</p>
      </div>
    </div>
  );

  return (
    <div className="widgets__container">
      <div className="widgets">
        <div className="widgets__header">
          <h2>Linkedin News</h2>
          <InfoIcon />
        </div>
        <a
          href="https://www.infotechnology.com/actualidad/android-12-cambia-el-aspecto-radicalmente-del-sistema-operativo-de-google/"
          target="_blank"
          rel="noopener noreferrer"
        >
          {newsArticle(
            "Android 12 radically changes the look of Google's operating system ",
            "Technology - 500 readers"
          )}
        </a>

        <a
          href="https://www.infotechnology.com/finanzas-digitales/precio-bitcoin-hoy-por-que-cayo-por-debajo-de-us-40-000-y-hasta-donde-puede-llegar/"
          target="_blank"
          rel="noopener noreferrer"
        >
          {newsArticle(
            "Bitcoin price today: why it fell below $ 40,000 and how far it can go",
            "Cryptocurrencies - 300 readers"
          )}
        </a>

        <a
          href="https://www.infotechnology.com/actualidad/cursos-de-programacion-gratuitos-en-udemy-que-ensenan-y-como-se-hacen/"
          target="_blank"
          rel="noopener noreferrer"
        >
          {newsArticle("Free programming courses", "Education - 1500 readers")}
        </a>
      </div>
      <div className="widgets__img">
        <img src={WidgetImg} alt="" />
      </div>
    </div>
  );
}

export default Widgets;

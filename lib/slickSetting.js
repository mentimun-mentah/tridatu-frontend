const arrowStyle = (oldStyle) => {
  return {
    ...oldStyle,
    background: "rgba(168, 168, 168, 0.6)",
    borderRadius: "50%",
    width: "35px",
    height: "35px",
    zIndex: "5",
    color: "white"
  }
}

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} cus-arrow-slick`}
      style={arrowStyle(style)}
      onClick={onClick}
    >
      <i className="fas fa-chevron-right arrow-slick" />
    </div>
  );
}

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} cus-arrow-slick`}
      style={arrowStyle(style)}
      onClick={onClick}
    >
      <i className="fas fa-chevron-left arrow-slick" />
    </div>
  );
}

const responsive = (dw, dl, tw, tl, mw, ml) => [
  {
    breakpoint: 1024,
    settings: {
      slidesToShow: dw,
      slidesToScroll: dl,
    }
  },
  {
    breakpoint: 768,
    settings: {
      slidesToShow: tw,
      slidesToScroll: tl,
    }
  },
  {
    breakpoint: 599,
    settings: {
      slidesToShow: mw,
      slidesToScroll: ml,
      centerMode: false,
      arrows: false,
      dots: true,
      centerPadding: "0",
    }
  },
  {
    breakpoint: 425,
    settings: {
      slidesToShow: mw,
      slidesToScroll: ml,
      centerMode: false,
      arrows: false,
      dots: true,
      centerPadding: "0",
    }
  },
  {
    breakpoint: 320,
    settings: {
      slidesToShow: mw,
      slidesToScroll: ml,
      centerMode: false,
      arrows: false,
      dots: true,
      centerPadding: "0",
    }
  }
]

export const infoStoreSettings = {
  dots: false,
  draggable: true,
  autoplay: true,
  vertical: true,
  verticalSwiping: true,
  swipeToSlide: true,
  speed: 450,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 992,
      settings: {
        vertical: false,
        verticalSwiping: false,
        slidesToShow: 4,
        slidesToScroll: 1,
      }
    },
    {
      breakpoint: 425,
      settings: {
        vertical: false,
        verticalSwiping: false,
        slidesToShow: 3,
        slidesToScroll: 1,
      }
    },
    {
      breakpoint: 320,
      settings: {
        vertical: false,
        verticalSwiping: false,
        slidesToShow: 3,
        slidesToScroll: 1,
      }
    }

  ]
}

export const infoStoreSettingsMobile = {
  dots: false,
  infinite: true,
  draggable: true,
  autoplay: true,
  swipeToSlide: true,
  speed: 450,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
      }
    },
    {
      breakpoint: 425,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      }
    },
    {
      breakpoint: 320,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      }
    }
  ]
}

export const bannerSettings = {
  dots: false,
  infinite: true,
  draggable: true,
  autoplay: true,
  speed: 300,
  slidesToShow: 1,
  slidesToScroll: 1,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  centerMode: true,
  centerPadding: "20%",
  responsive: responsive(1, 1, 1, 1, 1, 1)
}

export const brandSettings = {
  dots: false,
  infinite: true,
  draggable: true,
  autoplay: true,
  speed: 350,
  slidesToShow: 5,
  slidesToScroll: 1,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      }
    },
    {
      breakpoint: 425,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        arrows: false,
      }
    },
    {
      breakpoint: 320,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
      }
    }
  ]
};


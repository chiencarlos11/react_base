import React, { Component } from "react";
import Slider from "react-slick";
import Modal from "react-modal";
import InstagramEmbed from "react-instagram-embed";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./instagramSlider.css";
import leftIcon from "../../static/white-plane-left.png";
import rightIcon from "../../static/white-plane-right.png";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    width: "600px",
    marginLeft: "auto",
    marginRight: "auto",
    transform: "translate(-50%, -50%)",
    zIndex: "900",
    opacity: "0.5,"
  }
};

Modal.setAppElement("#root");

function matchID(element, imageID) {
  console.log("element = " + element.id);
  console.log("imageID = " + imageID);
  return element.id === imageID;
}

export default class Instagram extends Component {
  constructor(props) {
    super(props);

    this.filteredInstagramData = "";

    this.state = {
      currentExecId: this.props.execId,
      currentStoreId: this.props.storeId,
      currentTag: this.props.tags,
      loaded: "false",
      modalIsOpen: false,
      current_photo: ""
    };

    this.nextSlide = this.nextSlide.bind(this);
    this.previousSlide = this.previousSlide.bind(this);

    //Modal
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    //Instagram
    this.previousImage = this.previousImage.bind(this);
    this.nextImage = this.nextImage.bind(this);
  }

  openModal(instagram_link) {
    this.setState({ modalIsOpen: true });
    this.setState({ current_photo: instagram_link });
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = "#f00";
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  nextSlide() {
    this.refs.slider.slickNext();
  }

  previousSlide() {
    this.refs.slider.slickPrev();
  }

  componentDidMount() {
    this.refreshData();
  }

  refreshData() {
    var url =
      "https://api.instagram.com/v1/users/self/media/recent/?access_token=8473644139.0b82872.2185f3d55dbb4622a3fe542f43a3d098";

    if (this.props.access_token) {
      url =
        "https://api.instagram.com/v1/users/self/media/recent/?access_token=" +
        this.props.access_token;
    }

    fetch(url)
      .then(response => {
        return response.json();
      })
      .then(responseData => {
        console.log(responseData);
        return responseData;
      })
      .then(data => {
        this.setState({ instagramData: data });
        this.filterResultsByTag(this.state.currentTag);
        this.setState({ loaded: "true" });
      })
      .catch(err => {
        console.log("fetch error" + err);
      });
  }

  filterResultsByTag(tags) {
    if (tags === undefined || tags.length === 0) {
      this.filteredInstagramData = this.state.instagramData.data;
    } else if (tags == "__show_all__") {
      this.filteredInstagramData = this.state.instagramData.data;
    } else {
      var photoList = [];
      for (var tag of tags) {
        for (var i = 0; i < this.state.instagramData.data.length; i++) {
          var element = this.state.instagramData.data[i];
          if (element.tags.indexOf(tag) >= 0) {
            photoList.push(element);
          }
        }
      }
      this.filteredInstagramData = photoList;
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.tags === undefined || nextProps.tags.length <= 0) {
      return true;
    } else if (nextProps.tags === ["__show_all__"]) {
      this.filterResultsByTag(nextProps.tags);
      return true;
    }

    if (this.state.instagramData && nextProps.tags !== this.state.currentTags) {
      this.filterResultsByTag(nextProps.tags);
      return true;
    }

    return false;
  }

  previousImage(imageID) {
    let index = 0;
    let array = [];

    let curr = this.state.current_photo;

    if (this.state.currentTag) {
      array = this.filteredInstagramData;
    } else {
      array = this.state.instagramData.data;
    }

    index = array.findIndex(function(instagramImage) {
      return curr.id === instagramImage.id;
    });

    if (index === 0) {
      this.setState({ current_photo: array[array.length - 1] });
    } else {
      this.setState({ current_photo: array[index - 1] });
    }

  }

  nextImage(imageID) {
    let index = 0;
    let array = [];

    let curr = this.state.current_photo;

    if (this.state.currentTag) {
      array = this.filteredInstagramData;
    } else {
      array = this.state.instagramData.data;
    }

    index = array.findIndex(function(instagramImage) {
      return curr.id === instagramImage.id;
    });

    if (index === (array.length -1)) {
      this.setState({ current_photo: array[0] });
    } else {
      this.setState({ current_photo: array[index + 1] });
    }
  }

  render() {
    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 7,
      slidesToScroll: 1,
      autoplay: false,
      autoplaySpeed: 1500,
      lazyLoad: true,
      arrows: false,
      responsive: [
        {
          breakpoint: 1400,
          settings: {
            slidesToShow: 6
          }
        },
        {
          breakpoint: 1150,
          settings: {
            slidesToShow: 5
          }
        },
        {
          breakpoint: 1000,
          settings: {
            slidesToShow: 4
          }
        },
        {
          breakpoint: 780,
          settings: {
            slidesToShow: 3
          }
        }
      ]
    };

    if (this.state.loaded == "true") {
      return (
        <div className="container-instagram-gallery">
          <div className="sliderButton">
            <img
              className="arrow_image"
              src={leftIcon}
              onClick={this.previousSlide}
            />
          </div>
          <div className="slider">
            <Slider ref="slider" {...settings}>
              {this.filteredInstagramData.map(photo => (
                <img
                  className="image"
                  key={photo.id}
                  src={photo.images.standard_resolution.url}
                  alt={photo.id}
                  onClick={this.openModal.bind(this, photo)}
                />
              ))}
            </Slider>
          </div>
          <div className="sliderButton">
            <img
              className="arrow_image"
              src={rightIcon}
              onClick={this.nextSlide}
            />
          </div>
          <div>
            <Modal
              isOpen={this.state.modalIsOpen}
              onAfterOpen={this.afterOpenModal}
              onRequestClose={this.closeModal}
              style={customStyles}
              contentLabel="Example Modal"
              className="frontfacing"
            >
              <h2 ref={subtitle => (this.subtitle = subtitle)} />

              <div className="ModalBox">
                <div className="box2">
                  <InstagramEmbed
                    url={this.state.current_photo.link}
                    maxWidth={600}
                    hideCaption={false}
                    containerTagName="div"
                    protocol=""
                    injectScript
                    onLoading={() => {}}
                    onSuccess={() => {}}
                    onAfterRender={() => {}}
                    onFailure={() => {}}
                  />
                </div>

                <div className="sliderButton box1">
                  <button
                    onClick={this.previousImage.bind(
                      this,
                      this.state.current_photo.id
                    )}
                  >
                    {" "}
                    BACK{" "}
                  </button>
                </div>

                <div className="sliderButton box3">
                  <button
                    onClick={this.nextImage.bind(
                      this,
                      this.state.current_photo.id
                    )}
                  >
                    {" "}
                    NEXT{" "}
                  </button>
                </div>
              </div>
            </Modal>
          </div>
        </div>
      );
    } else {
      return <div className="height_full">Loading</div>;
    }
  }
}

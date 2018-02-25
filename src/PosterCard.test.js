import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import PosterCard from "./PosterCard";

describe("PosterCard", () => {
  const defaultProps = {
    posterUrl: "/mock-poster.png",
    movieDetails: {
      title: "Mock Movie 14",
      description: "Some movie description"
    }
  };

  it("should render correctly", () => {
    const props = { ...defaultProps };
    const wrapper = shallow(<PosterCard {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

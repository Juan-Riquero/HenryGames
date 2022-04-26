import Landing from "./components/Landing/Landing";
import Enzyme, { shallow } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";

Enzyme.configure({ adapter: new Adapter() });

describe("Landing", () => {
  xit("should have an title Welcome", () => {
    const wrapper = shallow(<Landing />);
    const title = wrapper.find("div h1");
    expect(title.text()).toBe("Welcome, Player1  Find what to play next. ");
  });
  it("should have a button Start", () => {
    const wrapper = shallow(<Landing />);
    const button = wrapper.find("Link p");
    expect(button.text()).toBe("ENTER");
  });
});
import { NavLink } from "react-router-dom";
import Modal from "./Modal";
import CreateRoomForm from "./CreateRoomForm";

function Header() {
  return (
    <>
      <header className="header">
        <nav>
          <Modal>
            <Modal.Open>
              <button>Create Room</button>
            </Modal.Open>
            <Modal.Content>
              <CreateRoomForm />
            </Modal.Content>
          </Modal>
          <NavLink to="/login">Go To Login</NavLink>
        </nav>
      </header>
    </>
  );
}

export default Header;

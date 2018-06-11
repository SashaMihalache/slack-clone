import React from 'react';
import decode from 'jwt-decode';
import Teams from '../components/Teams';
import Channels from '../components/Channels';
import AddChannelModal from '../components/modals/AddChannelModal';
import InvitePeopleModal from '../components/modals/InvitePeopleModal';

class Sidebar extends React.Component {

  state = {
    openAddChannelModal: false,
    invitePeopleModal: false
  }

  handleInvitePeopleClick = () => this.setState({ invitePeopleModal: true })

  handleCloseInvitePeopleClick = () => this.setState({ invitePeopleModal: false })

  handleAddChannelClick = () => this.setState({ openAddChannelModal: true })

  handleCloseAddChannelModal = () => this.setState({ openAddChannelModal: false });

  render() {
    const { teams, team } = this.props;
    const { openAddChannelModal, invitePeopleModal } = this.state;

    let username = '';

    try {
      const token = localStorage.getItem('token');
      const { user } = decode(token);
      // eslint-disable-next-line
      username = user.username;
    } catch (error) { }

    return (
      <React.Fragment>
        <Teams teams={teams} />
        <Channels
          teamName={team.name}
          username={username}
          channels={team.channels}
          teamId={team.id}
          users={[
            { id: 1, name: 'slackbot' },
            { id: 2, name: 'user1' }
          ]}
          onAddChannelClick={this.handleAddChannelClick}
          onInvitePeopleClick={this.handleInvitePeopleClick}
        />
        <AddChannelModal
          teamId={team.id}
          onClose={this.handleCloseAddChannelModal}
          open={openAddChannelModal} />

        <InvitePeopleModal
          teamId={team.id}
          onClose={this.handleCloseInvitePeopleClick}
          open={invitePeopleModal} />

      </React.Fragment>
    )
  }
}



export default Sidebar;



/** @jsx React.DOM */

// creating table component 
var VideoTable = React.createClass({
    render: function() {

        var rows = [];
        var sortVids = this.props.videos;
        // sort video using underscore.js sort function 
        sortVids =  _.sortBy( sortVids , this.props.sortVidsTarget.clickedTitle );
        // detect whether to sort ascending or descending 
        if (this.props.sortVidsTarget.sortOrder === 'ascending'){
            sortVids = sortVids.reverse(); 
        }

        sortVids.forEach(function(video) {
            if (video.title.indexOf(this.props.filterText) === -1) {
                return;
            }
            
            rows.push(<VideoRow video={video} key={video.id} />);
        }.bind(this));
        return (
                <tbody>{rows}</tbody>
        );
    }
});

// creating row component to go inside of table
var VideoRow = React.createClass({
    render: function() {
        return (
            <tr>
                <td>{this.props.video.title}</td>
                <td><img src={this.props.video.thumb_url_default}/></td>
                <td>{numeral(this.props.video.views).format('0,0,')}</td>
                <td>{this.props.video.created_on}</td>
            </tr>
        );
    }
});

// creating search bar
var SearchBar = React.createClass({
    handleChange: function() {
        this.props.onUserInput(
            this.refs.filterTextInput.getDOMNode().value
        );
    },

    render: function() {
        return (
            <form>
                <input
                    type="text"
                    placeholder="Search..."
                    value={this.props.filterText}
                    ref="filterTextInput"
                    onChange={this.handleChange}
                />
            </form>
        );
    }
});

// creating parent component 
var FilterableVideoTable = React.createClass({

    getInitialState: function() {
        return {
            filterText: '',
            sortVidsTarget: {clickedTitle:'views',sortOrder:'ascending'},
        };
    },
    // getting data 
  componentDidMount: function() {
    $.get(this.props.url, function() {
      if (this.isMounted()) {
        this.setState({
          videos: videos,
        });
      }
    }.bind(this));
  },
    handleUserInput: function(filterText) {
        this.setState({
            filterText: filterText,
        });
    },
     handleUserSort: function(clck){

            // indicate sort state of column to enable ascend / descend toggling 
            if (this.state.sortVidsTarget.sortOrder === 'ascending') {
            var sortAlternator = 'descending';
            } else if (this.state.sortVidsTarget.sortOrder === 'descending') {
                sortAlternator = 'ascending'; 
            }

        this.setState({
            sortVidsTarget: {clickedTitle: clck, sortOrder:sortAlternator},
        });

    },
    render: function() {
        return (
            <div>
                <SearchBar
                    filterText={this.state.filterText}
                    onUserInput={this.handleUserInput}
                />
               <table> 
        <thead>
            <tr>
                <th onClick={this.handleUserSort.bind(this, 'title')} className="clickAbleTitle">Title</th>
                <th>Preview Image</th>
                <th onClick={this.handleUserSort.bind(this, 'views')} className="clickAbleTitle">Views</th>
                <th onClick={this.handleUserSort.bind(this, 'created_on')} className="clickAbleTitle">Created On</th>
            </tr>
        </thead>
                <VideoTable
                    videos={this.state.videos}
                    filterText={this.state.filterText}
                    sortVidsTarget = {this.state.sortVidsTarget}
                />
                </table>
            </div>
        );
    }

});

React.render(<FilterableVideoTable url={'main.js'}/>, document.body);







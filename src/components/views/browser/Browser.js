import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SearchCard from './searchcard/SearchCard';
import AddSearchCardButton from './buttons/AddSearchCardButton';
import SelectFormat from './SelectFormat';
import SearchButton from './buttons/SearchButton';
import FullSearchButton from './buttons/FullSearchButton';
import shortid from 'shortid';
import { inspect } from 'util' // or directly

const minYear = 1700;
const maxYear = 1950;

const initialSearchCardObject = {
  id: shortid.generate(),
  authors: [],
  genres: [],
  keywords: '',
  timeFrom: minYear,
  timeTo: maxYear,
};

const inputVariant = 'standard';

class Browser extends React.Component {
  state = {
    cardList: [JSON.parse(JSON.stringify(initialSearchCardObject))],
    selectedFormats: [],
  };

  getCardIndex = id => {
    return this.state.cardList.findIndex(card => card.id === id);
  };

  handleChange = name => event => {
    // TODO: update cardList in state when input changes (in SearchCard)
    this.setState({
      [name]: event.target.value,
    });
  };

  // fügt eine leere Karte oder ein Duplikat einer Karte hinzu
  onAddSearchCard(inputValues) {

    if(this.state && this.state.cardList.length > 7 ) {
      // TODO: Hinweis anzeigen, dass nicht mehr als 8 Karten hinzugefügt werden können.
      return;
    }

    console.log(inputValues);

    let paramsPassed = (inputValues instanceof Object && 'authors' in inputValues);
    inputValues = paramsPassed?
      JSON.parse(JSON.stringify(inputValues)) : JSON.parse(JSON.stringify(initialSearchCardObject));

    inputValues.id = shortid.generate();

    this.setState(state => ({
      cardList: [...state.cardList, inputValues]
    }), () => {
      console.log('new cardList after add:' + JSON.stringify(this.state.cardList));
    });
  }

  updateSearchCardContent(id, prop, value) {
    // TODO: insert new search card input into browser state

  }

  deleteSearchCard(id) {
    if(this.state.cardList.length === 1) {
      // TODO: update index of remaining card to 0
      return; // letzte verbleibende Karte soll nicht gelöscht werden
    }
    this.setState(state => ({
      cardList: state.cardList.filter( card => (card.id !== id))
    }));
  }

  render() {
    const { classes } = this.props;
    const { cardList } = this.state;

    return(
      <div className={classes.root}>
        <div className={classes.flexContainerCards}>
          {cardList.map((card, index) => (
            <SearchCard
              key={card.id} // not passed to component by react! => use id instead
              id={card.id}
              index={index}
              initialValues={{
                authors: card.authors,
                genres: card.genres,
                keywords: card.keywords,
                timeFrom: card.timeFrom,
                timeTo: card.timeTo,
              }}
              inputVariant={inputVariant}
              getIndex={this.getCardIndex.bind(this)}
              onDuplicate={this.onAddSearchCard.bind(this)}
              onDelete={this.deleteSearchCard.bind(this)}
              onContentChange={this.updateSearchCardContent.bind(this)}
            />
          ))}
        </div>
        <AddSearchCardButton action={this.onAddSearchCard.bind(this)}/>
        <div className={classes.flexContainer}>
          <SelectFormat/>
        </div>
        <div className={classes.flexContainer}>
          <SearchButton/>
          <FullSearchButton/>
        </div>
      </div>
    );
  }
}

Browser.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = theme => ({
  root:{
    padding: theme.spacing.unit * 3,
  },
  flexContainerCards:{
    display: 'flex',
    flexFlow: 'row wrap',
    flexDirection: 'row-reverse',
    justifyContent: 'flex-end',
  },
  flexContainer:{
    display: 'flex',
    marginTop: theme.spacing.unit * 2,
  },
});

export default withStyles(styles)(Browser);
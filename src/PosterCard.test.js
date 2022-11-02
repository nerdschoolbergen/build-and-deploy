import React from 'react';
import renderer from 'react-test-renderer';
import PosterCard from './PosterCard';

describe('PosterCard', () => {
  const defaultProps = {
    posterUrl: '/mock-poster.png',
    movieDetails: {
      title: 'Mock Movie 14',
      description: 'Some movie description',
    },
  };

  it('should render correctly', () => {
    const { posterUrl, movieDetails } = { ...defaultProps };

    // Render the PosterCard component
    const component = renderer.create(
      <PosterCard posterUrl={posterUrl} movieDetails={movieDetails} />,
    );
    // Expect that its rendered state given these props is equal to the last committed rendered state (snapshot)
    // A snapshot is GUI state represented in code. Think of it like rendering the GUI, taking a picture of how it looks,
    // then the next time we run the test we do the same and compare the pictures. If there are any changes between the two pictures,
    // the test fails, making us manually confirm that the new picture is now the correct state (update the snapshot),
    // or investigate the diff if it was unexpected. Instead of actual pictures we use JSON to compare the gui state. This is snapshot testing.
    expect(component.toJSON()).toMatchSnapshot();
  });
});

import errorPage, { initialState } from 'core/reducers/errorPage';


describe('errorPage reducer', () => {
  it('defaults to no error and nothing to clear', () => {
    const state = errorPage(initialState, { type: 'unrelated' });
    expect(state).toEqual(initialState);
  });
});

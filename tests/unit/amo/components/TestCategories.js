import { shallow } from 'enzyme';
import React from 'react';

import { setViewContext } from 'amo/actions/viewContext';
import { CategoriesBase, mapStateToProps } from 'amo/components/Categories';
import { categoriesFetch, categoriesLoad } from 'core/actions/categories';
import {
  ADDON_TYPE_EXTENSION, ADDON_TYPE_THEME, CLIENT_APP_ANDROID,
} from 'core/constants';
import Button from 'ui/components/Button';
import LoadingText from 'ui/components/LoadingText';
import { dispatchClientMetadata, fakeCategory } from 'tests/unit/amo/helpers';
import { createStubErrorHandler, getFakeI18nInst } from 'tests/unit/helpers';
import ErrorList from 'ui/components/ErrorList';


describe('<Categories />', () => {
  let store;

  beforeEach(() => {
    store = dispatchClientMetadata().store;
  });

  function render({ ...props }) {
    const errorHandler = createStubErrorHandler();

    return shallow(
      <CategoriesBase
        addonType={ADDON_TYPE_EXTENSION}
        dispatch={store.dispatch}
        errorHandler={errorHandler}
        i18n={getFakeI18nInst()}
        {...mapStateToProps(store.getState())}
        {...props}
      />
    );
  }

  it('fetches categories if needed', () => {
    const dispatch = sinon.stub();
    const errorHandler = createStubErrorHandler();
    render({
      addonType: ADDON_TYPE_EXTENSION, dispatch, errorHandler,
    });

    sinon.assert.calledWith(dispatch, categoriesFetch({
      errorHandlerId: errorHandler.id,
    }));
  });

  it('does not fetch categories if already loading them', () => {
    store.dispatch(categoriesFetch({
      errorHandlerId: createStubErrorHandler().id,
    }));
    const dispatch = sinon.stub();
    render({ addonType: ADDON_TYPE_EXTENSION, dispatch });

    // Make sure only the viewContext was dispatched, not a fetch action.
    sinon.assert.calledWith(dispatch, setViewContext(ADDON_TYPE_EXTENSION));
    sinon.assert.calledOnce(dispatch);
  });

  it('does not fetch categories if already loaded', () => {
    store.dispatch(categoriesLoad({ result: [fakeCategory] }));
    const dispatch = sinon.stub();
    render({ addonType: ADDON_TYPE_EXTENSION, dispatch });

    // Make sure only the viewContext was dispatched, not a fetch action.
    sinon.assert.calledWith(dispatch, setViewContext(ADDON_TYPE_EXTENSION));
    sinon.assert.calledOnce(dispatch);
  });

  it('does not fetch categories if an empty set was loaded', () => {
    store.dispatch(categoriesLoad({ result: [] }));
    const dispatch = sinon.stub();
    render({ addonType: ADDON_TYPE_EXTENSION, dispatch });

    // Make sure only the viewContext was dispatched, not a fetch action.
    sinon.assert.calledWith(dispatch, setViewContext(ADDON_TYPE_EXTENSION));
    sinon.assert.calledOnce(dispatch);
  });

  it('changes viewContext if addonType changes', () => {
    const dispatch = sinon.stub();
    const root = render({
      addonType: ADDON_TYPE_EXTENSION,
      dispatch,
    });

    root.setProps({ addonType: ADDON_TYPE_THEME });

    sinon.assert.calledWith(dispatch, setViewContext(ADDON_TYPE_THEME));
  });

  it('does not dispatch setViewContext if addonType does not change', () => {
    const dispatch = sinon.stub();
    const root = render({
      addonType: ADDON_TYPE_EXTENSION,
      dispatch,
    });

    sinon.assert.calledWith(dispatch, setViewContext(ADDON_TYPE_EXTENSION));
    sinon.assert.calledTwice(dispatch);

    dispatch.reset();
    root.setProps();

    // Dispatch should not be called again because no new props were set.
    sinon.assert.notCalled(dispatch);
  });

  it('renders Categories', () => {
    const root = render({ addonType: ADDON_TYPE_EXTENSION });

    expect(root).toHaveClassName('Categories');
  });

  it('renders loading text when loading', () => {
    const root = render({
      addonType: ADDON_TYPE_EXTENSION,
      loading: true,
    });

    expect(root.find('.Categories-loading-info'))
      .toIncludeText('Loading categories.');
  });

  it('renders LoadingText components when loading', () => {
    const root = render({
      addonType: ADDON_TYPE_EXTENSION,
      loading: true,
    });

    expect(root.find('.Categories-loading-text').find(LoadingText))
      .toHaveLength(8);
  });

  it('renders categories if they exist', () => {
    const categoriesResponse = {
      result: [
        {
          ...fakeCategory,
          application: CLIENT_APP_ANDROID,
          name: 'Games',
          slug: 'Games',
          type: ADDON_TYPE_EXTENSION,
        },
        {
          ...fakeCategory,
          application: CLIENT_APP_ANDROID,
          name: 'Travel',
          slug: 'Travel',
          type: ADDON_TYPE_EXTENSION,
        },
      ],
    };

    store.dispatch(categoriesLoad(categoriesResponse));

    const root = render({
      addonType: ADDON_TYPE_EXTENSION,
    });

    expect(root.find('.Categories-list').childAt(0).find(Button))
      .toHaveProp('children', 'Games');
    expect(root.find('.Categories-list').childAt(1).find(Button))
      .toHaveProp('children', 'Travel');
  });

  it('sorts and renders the sorted categories', () => {
    const categoriesResponse = {
      result: [
        {
          ...fakeCategory,
          application: CLIENT_APP_ANDROID,
          name: 'Travel',
          slug: 'travel',
          type: ADDON_TYPE_EXTENSION,
        },
        {
          ...fakeCategory,
          application: CLIENT_APP_ANDROID,
          name: 'Music',
          slug: 'music',
          type: ADDON_TYPE_EXTENSION,
        },
        {
          ...fakeCategory,
          application: CLIENT_APP_ANDROID,
          name: 'Nature',
          slug: 'nature',
          type: ADDON_TYPE_EXTENSION,
        },
        {
          ...fakeCategory,
          application: CLIENT_APP_ANDROID,
          name: 'Games',
          slug: 'Games',
          type: ADDON_TYPE_EXTENSION,
        },
      ],
    };

    store.dispatch(categoriesLoad(categoriesResponse));

    const root = render({
      addonType: ADDON_TYPE_EXTENSION,
    });

    expect(root.find('.Categories-list').childAt(0).find(Button))
      .toHaveProp('children', 'Games');
    expect(root.find('.Categories-list').childAt(1).find(Button))
      .toHaveProp('children', 'Music');
    expect(root.find('.Categories-list').childAt(2).find(Button))
      .toHaveProp('children', 'Nature');
    expect(root.find('.Categories-list').childAt(3).find(Button))
      .toHaveProp('children', 'Travel');
  });

  it('renders a no categories found message', () => {
    const categoriesResponse = { result: [] };
    store.dispatch(categoriesLoad(categoriesResponse));
    const root = render();

    expect(root.find('.Categories-none-loaded-message'))
      .toIncludeText('No categories found.');
  });

  it('reports errors', () => {
    const errorHandler = createStubErrorHandler(
      new Error('example of an error')
    );
    const root = render({ errorHandler });

    expect(root.find(ErrorList)).toHaveLength(1);
  });
});

import { action, observable } from 'mobx';

import Navigation from '../Navigation/AppNavigation';

class NavigationStore {

  @observable headerTitle = "Launch"
  @observable.ref navigationState = {
    index: 0,
    routes: [
      { key: "Launch", routeName: "Launch" },
      //{ key: "LoginScreen", routeName: "LoginScreen" }
    ],
  }

  // NOTE: the second param, is to avoid stacking and reset the nav state
  @action dispatch = (action, stackNavState = true) => {
    const previousNavState = stackNavState ? this.navigationState : null;
    return this.navigationState = AppNavigator
        .router
        .getStateForAction(action, previousNavState);
  }
}

export default navigationStore = new NavigationStore()

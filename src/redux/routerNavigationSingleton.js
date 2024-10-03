class RouterNavigationSingleton {
	static navigate;

	static setNavigation(value) {
		RouterNavigationSingleton.navigate = value;
	}
	static getNavigation() {
		if (!RouterNavigationSingleton.navigate)
			return () => {
				console.error('Navigation is Undefined');
			};

		return RouterNavigationSingleton.navigate;
	}
}
export default RouterNavigationSingleton;

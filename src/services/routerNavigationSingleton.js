class RouterNavigationSingleton {
	static navigate: any;

	static setNavigation(value: any) {
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
export const useAppendToContainer = () => {
	const FullScreenContainer = document.getElementById('FullScreenContainer');
    const AppContainer = document.getElementById("App");
    return FullScreenContainer ?? AppContainer;
};

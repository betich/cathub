import { FunctionComponent } from "react";
import style from "./style.module.scss";

export const ThreedotLoading: FunctionComponent = () => {
	return (
		<div className={style['loading-container']}>
			<div className={style['dot-falling']}></div>
		</div>
	);
}

export const HeartLoading: FunctionComponent = () => {
	return (
		<>
			<div className={style['loading-container']}>
				<div className={style['lds-heart']}><div className={style['inner']}></div></div>
				<p className={style['lds-text']}>Loading...</p>
			</div>
		</>
	);
};

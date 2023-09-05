export async function parseData(input, params) {
	if (input.value != '') {
		try {
			const url = new URL(input.value);
			let response;
			if (params.host === 'pubmed.ncbi.nlm.nih.gov') {
				response = await fetch(`/api/pubmed?url=${url}`);
			} else if (params.host === 'www.nature.com') {
				response = await fetch(`/api/nature?url=${url}`);
			}
			const data = await response.json();
			return data;
		} catch (err) {
			return err;
		}
	}
}

export async function parseData_NEJM(input) {
	if (input.value != '') {
		try {
			const url = new URL(input.value);
			const response = await fetch(`/api/nejm?url=${url}`);
			const data = await response.json();
			return data;
		} catch (err) {
			return err;
		}
	}
}

export async function parseData_LANCET(input) {
	if (input.value != '') {
		try {
			const url = new URL(input.value);
			const response = await fetch(`/api/lancet?url=${url}`);
			const data = await response.json();
			return data;
		} catch (err) {
			return err;
		}
	}
}

export async function parseData_JAMA(input) {
	if (input.value != '') {
		try {
			const url = new URL(input.value);
			const response = await fetch(`/api/jama?url=${url}`);
			const data = await response.json();
			return data;
		} catch (err) {
			return err;
		}
	}
}

export async function parseData_BMJ(input) {
	if (input.value != '') {
		try {
			const url = new URL(input.value);
			const response = await fetch(`/api/bmj?url=${url}`);
			const data = await response.json();
			return data;
		} catch (err) {
			return err;
		}
	}
}

export async function parseData(input, params) {
	if (input.value != '') {
		try {
			const url = new URL(input.value);
			if (url.host != params.host) throw new Error('The provided URL does not match your target.');
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

export async function parseData_NEJM(input, params) {
	if (input.value != '') {
		try {
			const url = new URL(input.value);
			if (url.host != params.host) throw new Error('The provided URL does not match your target.');
			const response = await fetch(`/api/nejm?url=${url}`);
			const text = await response.json();
			console.log(text);
		} catch (err) {
			console.log(err);
		}
	}
}

export async function parseData_LANCET(input, params) {
	if (input.value != '') {
		try {
			const url = new URL(input.value);
			if (url.host != params.host) throw new Error('The provided URL does not match your target.');
			const response = await fetch(`/api/lancet?url=${url}`);
			const text = await response.json();
			console.log(text);
		} catch (err) {
			console.log(err);
		}
	}
}

export async function parseData_JAMA(input, params) {
	if (input.value != '') {
		try {
			const url = new URL(input.value);
			if (url.host != params.host) throw new Error('The provided URL does not match your target.');
			const response = await fetch(`/api/jama?url=${url}`);
			const text = await response.json();
			console.log(text);
		} catch (err) {
			console.log(err);
		}
	}
}

export async function parseData_BMJ(input, params) {
	if (input.value != '') {
		try {
			const url = new URL(input.value);
			if (url.host != params.host) throw new Error('The provided URL does not match your target.');
			const response = await fetch(`/api/bmj?url=${url}`);
			const text = await response.json();
			console.log(text);
		} catch (err) {
			console.log(err);
		}
	}
}

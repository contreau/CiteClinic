<script lang="ts">
	// code to clean a string of multiple comma separated urls,
	// if the user were to paste in a single long list of links
	function createURLlist(input: string) {
		const separated = input.split(',');
		return separated.map((url) => url.trim());
	}
</script>

<style lang="scss"></style>

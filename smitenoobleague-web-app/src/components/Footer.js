export default function Footer() {

    return (
        <div className="d-flex flex-column">
        <footer className="border-top footer text-muted bg-white">
            <div className="ml-2 mr-2 text-center">
                <div className="float-left footertext m-0 smallfootertext">&copy; Copyright {new Date().getFullYear()} - Smitenoobleague</div>
                <a href="https://www.buymeacoffee.com/kevinbevers"  rel="noreferrer" target="_blank" className="text-secondary text-underline"><div className="float-right footertext m-0"><u>Want to support me? Buy me ☕</u></div></a>
            </div>
        </footer>
        </div>
    );
}
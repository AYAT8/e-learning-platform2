import { Component } from "react";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error("Erreur interceptée :", error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-6 text-center text-red-600 bg-red-100 rounded">
                    <h2 className="text-2xl font-bold">❌ Une erreur est survenue</h2>
                    <p>Veuillez recharger la page ou contacter l’administrateur.</p>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
